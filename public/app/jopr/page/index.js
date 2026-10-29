import New_Ctx from "../lib/ctx.js?v=2";
import * as Stats from "../../job-woper/lib/index.js?v=2";
import DB_SCHEMA from "../db/schema.js?v=2";

const work_types =
{
  "full-time": "Fulltime",
  "part-time": "Part-time",
  "contract": "Contract",
  "temp": "Temporary",
  "casual": "Casual",
  "internship": "Internship",
  "volunteer": "Volunteer",
  "vacation": "Vacation",
  "other": "Other"
};

Main();
async function Main()
{
  if ("serviceWorker" in navigator) 
  {
    //await navigator.serviceWorker.register("./lib/service-worker.js");
  }

  const ctx = await New_Ctx();
  const new_install = await ctx.Profile.Is_Blank_Install(ctx);
  if (new_install)
  {
    Render_Marketing(ctx);
  }
  else
  {
    await Render_App(ctx);
  }

  import_btn.addEventListener("click", () => On_Click_Import_Btn(ctx));

  Update_Chart(ctx);
}

function Render_Marketing(ctx)
{
  launch_btn.addEventListener("click", e => On_Click_Launch_Btn(ctx));

  nav_elem.classList.add("hidden");
  app_body.classList.add("hidden");
  marketing_body.classList.remove("hidden");
}

async function Render_App(ctx)
{
  marketing_body.classList.add("hidden");
  nav_elem.classList.remove("hidden");
  app_body.classList.remove("hidden");

  //Set_Options(note_status_select, ctx.Job.job_status, s => s.id, s => s.label);
  Set_Options(job_status_select, ctx.Job.job_status, s => s.id, s => s.label);
  if (window.location.search)
  {
    profile_btn.href = "./page/profiles.html" + window.location.search;
  }

  const title_elem = document.querySelector("#hdr_elem>h1.title");
  //title_elem.addEventListener("click", () => On_Click_Title(ctx));

  export_btn.onclick = () => On_Click_Export_Btn(ctx);

  jobs_btn.onclick = () => Show_View(jobs_list);
  jobs_menu?.addEventListener("add", (e) => On_Click_Edit_Job(e, null, ctx));
  jobs_menu?.addEventListener("ai", () => On_Click_AI_Add_Job(ctx));
  jobs_list.addEventListener("render", e => Render_Job_Item(e, ctx));
  jobs_filter.addEventListener("search", () => Render_Job_Items(ctx));
  job_agency_select?.addEventListener("add", On_Click_Add_Agency);
  //job_agency_select?.addEventListener("edit", On_Click_Edit_Agency);
  job_contacts_select?.addEventListener("add", e => On_Click_Edit_Job_Contact(e, ctx));
  job_contacts_select?.addEventListener("edit", e => On_Click_Edit_Job_Contact(e, ctx));
  //job_contacts_select?.addEventListener("delete", e => On_Click_Delete_Job_Contact(e, ctx));

  jobs_filter.db = ctx.db;
  await jobs_filter.Load_Filters();
  Render_Job_Items(ctx);
}

// events =========================================================================

function On_Click_Launch_Btn(ctx)
{
  window.location.href = "./page/profiles.html?action=ai" + (window.location.search ? ("&" + window.location.search.substring(1)) : "");
}

async function On_Click_Title(ctx)
{
  const jobs = await ctx.Job.Select(ctx);
  for (const job of jobs)
  {
    const last_action = await ctx.Job.Get_Last_Update(ctx.db, job.id);
    const last_action_time = last_action?.timestamp;

    if (job.last_update == null || job.last_update == undefined)
    {
      job.last_update = last_action_time || 0;
      await ctx.Job.Save(ctx, job);
      console.log("On_Click_Title(): has no update ", job.id);
    }
    else if (last_action_time && last_action_time > job.last_update)
    {
      job.last_update = last_action_time;
      await ctx.Job.Save(ctx, job);
      console.log("On_Click_Title(): has old update ", job.id);
    }

    /*if (job.last_update == null || job.last_update == undefined)
    {
      console.log("On_Click_Title():", 
        "last_update:", job.last_update, 
        "id:", job.id, 
        "title:", job.role_title, 
      );
    }*/

    /*if (job.contact_id)
    {
      if (!ctx.Utils.Is_Empty(job.contact_ids) && !job.contact_ids.includes(job.contact_id))
      {
        job.contact_ids.push(job.contact_id);
      }
      else
      {
        job.contact_ids = [job.contact_id];
      }
      delete job.contact_id;

      await ctx.Job.Delete(ctx, job.id);
      await ctx.Job.Save(ctx, job);
    }*/

    /*if (job.cv)
    {
      console.log("On_Click_Title(): updated cv for job ", job.id);
      job.cv.legacy_jobs = await ctx.Profile.Job_Select_Recent(ctx);
      await ctx.Job.Save(ctx, job);
    }*/
  }
}

async function On_Click_Import_Btn(ctx)
{
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';

  input.onchange = async (e) => 
  {
    const file = e.target.files[0];
    if (!file) return;

    const text = await file.text();
    const db_data = JSON.parse(text);

    const attachments = db_data.attachments;
    if (attachments)
    {
      for (const attachment of attachments)
      {
        if (attachment.file)
        {
          attachment.file = await ctx.Utils.Deserialize_File(attachment.file);
        }
      }
    }

    await ctx.db.Clear();
    await ctx.db.Save_To_IndexedDB(db_data, DB_SCHEMA);
    Render_Job_Items(ctx);
    Alert("Data imported from " + file.name + " to IndexedDB instance.");
  };

  input.click();
}

async function On_Click_Export_Btn(ctx)
{
  const db_data = {};
  const table_names = Array.from(ctx.db.db.objectStoreNames);
  for (const table_name of table_names)
  {
    db_data[table_name] = await ctx.db.Get_All(table_name);
  }

  if (Array.isArray(db_data.attachments) && db_data.attachments.length > 0)
  {
    for (const attachment of db_data.attachments)
    {
      if (attachment.file)
      {
        attachment.file = await ctx.Utils.Serialize_File(attachment.file);
      }
    }
  }

  const json_string = JSON.stringify(db_data, null, 2);
  const blob = new Blob([json_string], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const filename = `jopr-data-${new Date().toISOString().split('T')[0]}.json`;
  ctx.Utils.Download_File(blob, filename);

  Alert("Data exported successfully!");
}

// rendering ======================================================================

async function Update_Chart(ctx)
{
  const queries = await Stats.Query.Select_All();
  const seek_queries = queries.filter(q => q.src == "seek");
  const random_index = Math.floor(Math.random() * seek_queries.length);
  const query = seek_queries[random_index];
  console.log("query =", query);
  const query_id = query.id;
  const one_week_ago = Date.now() - (ctx.Utils.MILLIS_WEEK * 4);
  const data = await Stats.Trend.Select_By_Query_Id(query_id);
  const recent_data = data.filter(d => d.datetime >= one_week_ago);
  if (recent_data && recent_data.length > 0)
  {
    const chart_data = recent_data.map(t => { return { x: t.datetime, y: t.count } });
    //console.log("chart_data =", chart_data);
    chart_elem.items = {"items": chart_data};

    const chart_data_by_time = chart_data.sort((a, b) => a.x - b.x);
    const start_count = chart_data_by_time[0].y;
    const end_count = chart_data_by_time[chart_data_by_time.length - 1].y;
    const diff_count = end_count - start_count;
    const percent_change = diff_count / start_count * 100;
    let title_html = query.title + "<br>" + percent_change.toFixed(2) + "%";
    chart_elem.svg.classList.remove("trend-up");
    chart_elem.svg.classList.remove("trend-down");
    chart_elem.svg.classList.remove("trend-flat");
    if (percent_change > 0)
    {
      //title_html += "<br><img src='./image/green/trending_up.svg' class='trend'>";
      chart_elem.svg.classList.add("trend-up");
    }
    else if (percent_change < 0)
    {
      //title_html += "<br><img src='./image/red/trending_down.svg' class='trend'>";
      chart_elem.svg.classList.add("trend-down");
    }
    else
    {
      //title_html += "<br><img src='./image/yellow/trending_flat.svg' class='trend'>";
      chart_elem.svg.classList.add("trend-flat");
    }
    chart_elem.setAttribute("title", title_html);
  }
  else
  {
    chart_elem.items = null;
  }

  setTimeout(() => Update_Chart(ctx), 60000);
}

function Toggle_Field(value, value_elem, label_elem)
{
  if (value)
  {
    value_elem.textContent = value;
    value_elem.style.display = null;
    label_elem.style.display = null;
  }
  else
  {
    value_elem.textContent = null;
    value_elem.style.display = "none";
    label_elem.style.display = "none";
  }
}

function Show_View(view_elem)
{
  jobs_list.classList.add("hidden");
  contacts_list.classList.add("hidden");
  companies_list.classList.add("hidden");
  //marketing_body.classList.add("hidden");

  view_elem.classList.remove("hidden");
  //app_body.classList.remove("hidden");
}

function Set_Options(select_elem, options, value_fn, text_fn)
{
  if (select_elem)
  {
    select_elem.innerHTML = '<option value="">None</option>';
    if (options)
    {
      for (const option of options)
      {
        const value = value_fn(option);
        const text = text_fn(option);

        const option_elem = document.createElement("option");
        option_elem.value = value;
        option_elem.textContent = text;
        select_elem.appendChild(option_elem);
      }
    }
  }
}

function Alert(msg)
{
  const char_millis = 35;
  const wait_millis = 5000;

  On_Render(0, 1, On_Completed_Reverse);

  function On_Completed_Reverse()
  {
    setTimeout(() => On_Render(msg.length, -1, On_Completed_Clr), wait_millis);
  }
  function On_Completed_Clr()
  {
    alert_elem.textContent = "";
  }
  function On_Render(length, step, on_complete_fn)
  {
    alert_elem.textContent = "[ " + msg.substring(0, length) + " ]";
    if ((step > 0 && length <= msg.length) || (step < 0 && length >= 0))
    {
      setTimeout(() => On_Render(length + step, step, on_complete_fn), char_millis);
    }
    else if (on_complete_fn)
    {
      on_complete_fn();
    }
  }
}

// on click edit ==================================================================

async function On_Click_Edit_Job(event, job, ctx)
{
  job_agency_select.items = await ctx.Agency.Get_Items(ctx);
  job_agency_select.job = job;

  job_contacts_select.items = await ctx.Contact.Select_Extended(ctx);
  job_contacts_select.job = job;

  const form_data = await job_dialog.Show_Async(job);
  if (form_data)
  {
    form_data.id = job?.id;
    if (form_data.agency_id == "new")
    {
      form_data.agency = job_agency_select.selected_item;
    }

    const is_saved = await ctx.Job.Save(ctx, form_data);
    if (is_saved)
    {
      await Render_Job_Items(ctx);
      Alert("Job saved successfully.");
    }
    else
    {
      Alert("Failed to save job.");
    }
  }
}

// education add/edit

// cv job add/edit

async function Save_Obj(obj, form_data, save_fn, msg_success, msg_fail)
{
  let new_obj = null;

  if (form_data)
  {
    new_obj = {...obj, ...form_data};
    const new_id = await save_fn(new_obj);
    if (new_id)
    {
      new_obj.id = new_id;
      Alert(msg_success);          
    }
    else
    {
      Alert(msg_fail);
    }
  }

  return new_obj;
}

// jobs ===========================================================================

/**
 * @param {Context} ctx
 */
async function Render_Job_Items(ctx)
{
  let jobs = 
    await ctx.Job.Select_All_Extended_Sorted(ctx, jobs_filter.value);

  jobs_list.value = jobs;
}

function Render_Job_Item(event, ctx)
{
  const item_elem = event.detail.item_elem;
  const job = item_elem.item_obj;
  const job_id = job.id;
  //console.log("Render_Job_Item(): job =", job);

  const title_text = ctx.Utils.Append_Str(job.role_title, job.company, " - ");
  item_elem.role_title_elem.textContent = title_text;

  let subtitle_text = 
    ctx.Utils.Append_Str(job.contact?.name, job.agency_name, " @ ");
  subtitle_text = 
    ctx.Utils.Append_Str(subtitle_text, ctx.Job.Time_Since_Last_Update(job), " - ");
  subtitle_text = 
    ctx.Utils.Append_Str("#" + job.id, subtitle_text, " - ");
  item_elem.contact_elem.textContent = subtitle_text;

  item_elem.contacts_elem.value = job.contacts;

  item_elem.job_details_elem.value = job;

  if (ctx.Utils.Is_Empty(job.attachments))
  {
    item_elem.attachment_list.remove();
  }
  else
  {
    item_elem.attachment_list.addEventListener("render", e => Render_Attachment_Item(e, ctx));
    item_elem.attachment_list.value = job.attachments;
  }

  const note_html = job.latest_note ?
    "Latest Note (" + job.latest_note_time_formatted + "):<br> " + job.latest_note : null;
  item_elem.note_elem.value = note_html;
  
  item_elem.status_elem.textContent = job.status;

  item_elem.job_menu.addEventListener("attach", e => On_Click_Attach_Files(e, job_id, ctx));
  item_elem.job_menu.addEventListener("view", e => On_Click_View_Job(e, job_id, ctx));
  item_elem.job_menu.addEventListener("edit", e => On_Click_Edit_Job(e, job, ctx));
  item_elem.job_menu.addEventListener("delete", e => On_Click_Delete_Job(e, job_id, ctx));
  item_elem.job_menu.addEventListener("download", e => On_Click_Download_Job(e, job_id, ctx));
  item_elem.job_menu.addEventListener("status", e => On_Click_Add_Note(e, job_id, ctx));
  item_elem.job_menu.addEventListener("gencv", e => On_Click_Generate_CV(e, job_id, ctx));
  item_elem.job_menu.addEventListener("genletter", e => On_Click_Generate_Cover_Letter(e, job_id, ctx));

  item_elem.status_elem.classList.remove("old");
  item_elem.classList.remove("failed");
  if (ctx.Job.Is_Failed(job))
    item_elem.classList.add("failed");
  else if (ctx.Job.Is_Old(job))
    item_elem.classList.add("old");
}

function Render_Attachment_Item(event, ctx)
{
  const item_elem = event.detail.item_elem;
  const attachment = item_elem.item_obj;

  const name = attachment.filename || attachment.file?.name || 'Unnamed file';
  const size = attachment.size || attachment.file?.size || 0;
  const size_text = size ? ` (${Math.round(size / 1024)} KB)` : '';
  item_elem.link2_btn.textContent = name + size_text;

  //item_elem.link2_btn.addEventListener("click", () => On_Click_Attachment(attachment));
  item_elem.open_btn.addEventListener("click", () => On_Click_Attachment(ctx, attachment));
  item_elem.del2_btn.addEventListener("click", () => On_Click_Delete_Attachment(ctx, attachment));
  item_elem.download_btn.addEventListener("click", () => On_Click_Download_Attachment(ctx, attachment));
}

async function On_Click_AI_Add_Job(ctx)
{
  const form_data = await email_dialog.Show_Async();
  const job = await ctx.Job.AI_Import(ctx, form_data?.email_text, info_elem.Info);
  if (job)
  {
    Alert("Job extracted and added successfully!");
    await Render_Job_Items(ctx);
  }
}

function On_Click_Attachment(ctx, attachment)
{
  const filename = attachment.filename || attachment.file?.name || 'Unnamed file';
  ctx.Utils.Show_File(attachment.file, filename);
}

function On_Click_Download_Attachment(ctx, attachment)
{
  const filename = attachment.filename || attachment.file?.name || 'Unnamed file';
  const blob = new Blob([attachment.file], { type: 'application/octet-stream' });
  ctx.Utils.Download_File(blob, filename);

  Alert("Attachment downloaded successfully!");
}

async function On_Click_Delete_Attachment(ctx, attachment)
{
  const confirmed = await warning_dlg.Confirm("Are you sure you want to delete this attachment?");
  if (confirmed)
  {
    await ctx.db.Delete("attachments", [attachment.id]);
    await Render_Job_Items(ctx);
  }
}

async function On_Click_Download_Job(e, job_id, ctx)
{
  const job = await ctx.db.Select_By_Id("jobs", job_id);

  const filename = `jopr-${new Date().toISOString().split('T')[0]}.json`;
  const json_string = JSON.stringify(job, null, 2);
  const blob = new Blob([json_string], { type: 'application/json' });
  ctx.Utils.Download_File(blob, filename);

  Alert("Job exported successfully!");
}

async function On_Click_Attach_Files(event, job_id, ctx)
{
  const files = await ctx.Utils.Select_Files();
  if (files && files.length > 0)
  {
    await ctx.Job.Attachment_Add_By_Job_Id(ctx, job_id, files);
    await Render_Job_Items(ctx);
    Alert(`${files.length} file${files.length === 1 ? '' : 's'} attached to the job.`);
  }
}

async function On_Click_Delete_Job(event, job_id, ctx)
{
  const confirmed = await warning_dlg.Confirm("Are you sure you want to delete this job?");
  if (confirmed)
  {
    await ctx.db.Delete("jobs", [job_id]);
    const attachment_ids =
      await ctx.db.Select_Ids("attachments", a => a.job_id === job_id);
    await ctx.db.Delete("attachments", attachment_ids);
    const action_log_ids =
      await ctx.db.Select_Ids("action_logs", l => l.job_id === job_id);
    await ctx.db.Delete("action_logs", action_log_ids);

    await Render_Job_Items(ctx);
    Alert("Job deleted successfully.");
  }
}

async function On_Click_Generate_CV(e, job_id, ctx)
{
  const profiles = await ctx.Profile.Select_All(ctx);
  const select_elem = gencv_dialog.profiles_select;
  Set_Options(select_elem, profiles, p => p.id, p => p.title);
  const profile = await ctx.Profile.Select_Active(ctx);

  const form_data = await gencv_dialog.Show_Async({profile_id: profile?.id});
  if (form_data)
  {
    const gen_cv_url = 
      ctx.routes["gen-cv-2"](job_id, form_data.profile_id, form_data.do_regen, form_data.ignore_titles);
    window.open(gen_cv_url, "_blank");
  }
}

function On_Click_Generate_Cover_Letter(e, job_id, ctx)
{
  window.open(ctx.routes["gen-cl"](job_id), "_blank");
}

async function On_Click_View_Job(event, job_id, ctx)
{
  const curr_job = await ctx.db.Select_By_Id("jobs", job_id);

  job_det_dialog.role_elem.innerText = curr_job.role_title;
  job_det_dialog.des_elem.innerText = curr_job.description || "No job description available.";

  const contact = await ctx.db.Select_By_Id("contacts", curr_job.contact_id);
  const agency = await ctx.db.Select_By_Id("agencies", curr_job.agency_id);
  job_det_dialog.contact_name_elem.textContent = contact?.name;
  job_det_dialog.contact_agency_elem.textContent = agency?.name;
  Toggle_Field(contact?.phone, job_det_dialog.contact_phone_elem, job_det_dialog.contact_phone_img);
  Toggle_Field(contact?.email, job_det_dialog.contact_email_elem, job_det_dialog.contact_email_img);

  if (agency?.url)
    job_det_dialog.contact_agency_elem.href = agency?.url;
  else
    job_det_dialog.contact_agency_elem.removeAttribute("href");
  
  job_det_dialog.Show();
}

async function On_Click_Add_Note(e, job_id, ctx)
{
  const form_data = await note_dialog.Show_Async();
  await ctx.Job.Action_Add_By_Job_Id(ctx, job_id, form_data?.note, form_data?.status);
  await Render_Job_Items(ctx);
}

// job_agency_select events ===================================================

async function On_Click_Add_Agency()
{
  const form_data = await company_dialog.Show_Async();
  if (form_data)
  {
    form_data.title = form_data.name;
    form_data.value = "new";
    job_agency_select.selected_item = form_data;
  }
}

// job_contacts_select events ========================================================

async function On_Click_Add_Contact(event, ctx)
{
  contact_dialog.agency_select.innerHTML = await ctx.Agency.Get_Options(ctx);
  const form_data = await contact_dialog.Show();
  if (form_data)
  {
    form_data.title = ctx.Contact.Get_Name(form_data);
    job_contacts_select.Add(form_data);
  }
}

async function On_Click_Edit_Job_Contact(event, ctx)
{
  let contact = event.detail;

  contact_dialog.agency_select.innerHTML = await ctx.Agency.Get_Options(ctx);
  const form_data = await contact_dialog.Show(contact);
  if (form_data)
  {
    form_data.is_dirty = true;
    form_data.title = ctx.Contact.Get_Name(form_data);
    job_contacts_select.Add(form_data);
  }
}

async function On_Click_Delete_Job_Contact(event)
{
  const contact = event.detail;
  job_contacts_select.Remove(contact);
}

