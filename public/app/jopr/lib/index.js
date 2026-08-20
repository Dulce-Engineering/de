import Utils from "../../../lib/Utils.js";
import JOPR from "./Utils.js";
import New_Ctx from "./ctx.js";
import * as Stats from "../../job-woper/lib/index.js";

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

  const jobs_count = await ctx.Job.Count(ctx);
  if (jobs_count > 0)
  {
    Render_App(ctx);
  }
  else
  {
    Render_Marketing(ctx);
  }

  Update_Chart(ctx);
}

function Render_Marketing(ctx)
{
  launch_btn.addEventListener("click", e => On_Click_Launch_Btn(ctx));

  app_body.classList.add("hidden");
  marketing_body.classList.remove("hidden");
}

async function Render_App(ctx)
{
  marketing_body.classList.add("hidden");
  app_body.classList.remove("hidden");

  Set_Options(note_status_select, ctx.Job.job_status, s => s.id, s => s.label);
  Set_Options(job_status_select, ctx.Job.job_status, s => s.id, s => s.label);
  Set_Options(career_work_type_select, Object.keys(ctx.Job.work_types), t => t, t => work_types[t]);

  const title_elem = document.querySelector("#hdr_elem>h1.title");
  //title_elem.addEventListener("click", () => On_Click_Title(ctx));

  import_btn.onclick = () => On_Click_Import_Btn(ctx);
  export_btn.onclick = () => On_Click_Export_Btn(ctx);

  jobs_btn.onclick = () => Show_View(jobs_list);
  job_agency_select.addEventListener("change", Toggle_New_Agency_Fields);
  jobs_menu.addEventListener("add", (e) => On_Click_Edit_Job(e, null, ctx));
  jobs_menu.addEventListener("ai", () => On_Click_AI_Add_Job(ctx));
  jobs_list.addEventListener("render", e => Render_Job_Item(e, ctx));
  jobs_filter.addEventListener("search", () => Render_Job_Items(ctx));
  job_contacts.addEventListener("add", On_Click_Add_Contact);
  job_contacts.addEventListener("select", e => On_Click_Select_Contact(e, ctx));
  job_contacts.addEventListener("delete", e => On_Click_Delete_Job_Contact(e, ctx));
  job_contacts.addEventListener("edit", e => On_Click_Edit_Job_Contact(e, ctx));
  Render_Job_Items(ctx);

  companies_btn.onclick = () => Show_View(companies_list);
  add_company_btn.onclick = (e) => On_Click_Add_Company(e, null, ctx);
  companies_list.addEventListener("render", e => Render_Company_Item(e, ctx));
  Render_Companies(ctx);

  contacts_btn.onclick = () => Show_View(contacts_list);
  contacts_list.addEventListener("add", e => On_Click_Edit_Contact(e, ctx));
  contacts_list.addEventListener("edit", e => On_Click_Edit_Contact(e, ctx));
  contacts_list.addEventListener("delete", e => On_Click_Delete_Contact(e, ctx));
  const contacts = await ctx.Contact.Select_Extended(ctx);
  contacts_list.value = contacts;

  profile_btn.onclick = () => Show_View(profile_elem);
  profile_menu.addEventListener("edit", () => On_Click_Edit_Profile(ctx));
  profile_menu.addEventListener("ai", () => On_Click_AI_Add_Profile(ctx));
  profile_menu.addEventListener("download", () => On_Click_Download_Profile(ctx));
  Render_Profile(ctx);

  edu_list_menu.addEventListener("add", (e) => On_Click_Update_Edu(e, null, ctx));
  edu_list.addEventListener("render", (e) => Render_Edu_Item(e, ctx));
  Render_Education(ctx);

  career_list_menu.addEventListener("add", (e) => On_Click_Career_Edit(ctx, null));
  career_list.addEventListener("render", (e) => Render_Career_Item(ctx, e));
  Render_Career(ctx);

  project_list.save_fn = project => ctx.Project.Save(ctx, project);
  project_list.delete_fn = project_id => ctx.Project.Delete(ctx, project_id);
  project_list.addEventListener("alert", e => Alert(e.detail));
  const projects = await ctx.Project.Select(ctx);
  project_list.value = projects;
}

// events =========================================================================

function On_Click_Launch_Btn(ctx)
{
  Render_App(ctx);
  Show_View(profile_elem);

  Alert("Please add details regarding your work kistory.");
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

    await ctx.db2.Clear();
    await ctx.db2.Save_To_IndexedDB(db_data, DB_SCHEMA);
    Render_Job_Items(ctx);
    Alert("Data imported from " + file.name + " to IndexedDB instance.");
  };

  input.click();
}

async function On_Click_Export_Btn(ctx)
{
  const db_data = {};
  const table_names = Array.from(ctx.db2.db.objectStoreNames);
  for (const table_name of table_names)
  {
    db_data[table_name] = await ctx.db2.Get_All(table_name);
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

// career & profile ===============================================================

async function Render_Profile(ctx)
{
  const profile = await ctx.Profile.Select_First(ctx);
  if (profile)
  {
    profile_name.textContent = profile.name || "N/A";
    profile_address.textContent = profile.address || "N/A";
    profile_seek_url.textContent = profile.seek_url || "N/A";
    profile_linkedin_url.textContent = profile.linkedin_url || "N/A";
    profile_residency_status.textContent = profile.residency_status || "N/A";
    profile_personal_summary.innerHTML = Str_To_HTML(profile.personal_summary || "N/A");
    profile_skills.textContent = profile.skills || "N/A";
    profile_interests.innerHTML = Str_To_HTML(profile.interests || "N/A");

    profile_details.style.display = null;
    no_profile_details.style.display = "none";
  }
  else
  {
    profile_details.style.display = "none";
    no_profile_details.style.display = null;
  }
}

async function On_Click_Edit_Profile(ctx)
{
  const profile = await ctx.Profile.Select_First(ctx);
  const form_data = await profile_form.Show_Async(profile);
  if (form_data)
  {
    form_data.id = profile?.id;
    const is_saved = await ctx.Profile.Save(ctx, form_data);
    if (is_saved)
    {
      await Render_Profile(ctx);
      Alert("Profile saved successfully.");
    }
    else
    {
      Alert("Failed to save profile.");
    }
  }
}

async function On_Click_Download_Profile(ctx)
{
  const employee_profile = await ctx.Profile.Select_First(ctx);
  const education = await ctx.Profile.Edu_Select(ctx);
  const career = await ctx.Profile.Job_Select(ctx);
  for (const job of career)
  {
    job.start_date = job.start_date ? new Date(job.start_date).toISOString().split('T')[0] : null;
    job.end_date = job.end_date ? new Date(job.end_date).toISOString().split('T')[0] : null;
  }
  const employee =
  {
    employee_profile,
    education,
    job_history: career
  };

  const filename = `jopr-profile-${new Date().toISOString().split('T')[0]}.json`;
  const json_string = JSON.stringify(employee, null, 2);
  const blob = new Blob([json_string], { type: 'application/json' });
  ctx.Utils.Download_File(blob, filename);

  Alert("Data exported successfully!");
}

async function On_Click_AI_Add_Profile(ctx)
{
  const files = await ctx.Utils.Select_Files();
  if (files && files.length > 0) 
  {
    console.info("Processing CV...");
    const cv_blob = files[0];
    const cv_data = await ctx.ai.Extract_CV(ctx.ai, cv_blob);

    await ctx.db2.Delete_All("education");
    await ctx.db2.Insert_Items("education", cv_data.educations);
    await ctx.db2.Delete_All("career");
    await ctx.db2.Insert_Items("career", cv_data.career);

    Alert("CV extracted successfully!");
  }
}

async function Render_Education(ctx)
{
  const certificates = await ctx.Profile.Edu_Select(ctx);
  edu_list.value = certificates;
}

function Render_Edu_Item(event, ctx)
{
  const item_elem = event.detail.item_elem;
  const edu = item_elem.item_obj;
  const edu_id = edu.id;

  const details = ctx.Utils.Append_Str(edu.institution, edu.year, " - ");
  item_elem.edu_title_elem.textContent = edu.title || "Unnamed Education";
  item_elem.edu_det_elem.textContent = details;

  item_elem.edu_item_menu.addEventListener("edit", (e) => On_Click_Update_Edu(e, edu_id, ctx));
  item_elem.edu_item_menu.addEventListener("delete", (e) => On_Click_Delete_Edu(e, edu_id, ctx));
}

async function On_Click_Update_Edu(e, id, ctx)
{
  const curr_edu = await ctx.Profile.Edu_Select_By_Id(ctx, id);
  const form_data = await edu_dialog.Show_Async(curr_edu);
  if (form_data)
  {
    form_data.id = id;
    const is_saved = await ctx.Profile.Edu_Save(ctx, form_data);
    if (is_saved)
    {
      await Render_Education(ctx);
      Alert("Education saved successfully.");
    }
    else
    {
      Alert("Failed to save education.");
    }
  }
}

async function On_Click_Delete_Edu(e, id, ctx)
{
  const confirmed = await warning_dlg.Confirm("Are you sure you want to delete this certificate?");
  if (confirmed)
  {
    const is_deleted = await ctx.Profile.Edu_Delete(ctx, id);
    if (is_deleted)
    {
      await Render_Education(ctx);
      Alert("Certificate deleted successfully.");
    }
    else
    {
      Alert("Failed to delete certificate.");
    }
  }
}

async function Render_Career(ctx)
{
  const jobs = await ctx.Profile.Job_Select(ctx);
  career_list.value = jobs;
}

function Render_Career_Item(ctx, event)
{
  const item_elem = event.detail.item_elem;
  const job = item_elem.item_obj;
  const job_id = job.id;

  const start_time = job.start_date ? new Date(job.start_date) : null;
  const start_time_str = ctx.Utils.To_Date_Str(start_time);
  const end_time = job.end_date ? new Date(job.end_date) : null;
  const end_time_str = ctx.Utils.To_Date_Str(end_time);
  const duration_str = Duration_Str(start_time, end_time);
  let time_str = ctx.Utils.Append_Str(start_time_str, end_time_str, " - ");
  time_str = ctx.Utils.Append_Str(time_str, "(" + duration_str + ")", " ");
  const role = ctx.Utils.Append_Str(job.role_titles, Work_Type_Label(ctx, job.work_type), " - ");
  const summ = ctx.Utils.Append_Str(role, job.location, " - ");

  item_elem.career_company_elem.textContent = job.company_name || "N/A";
  item_elem.career_title_elem.textContent = summ || "N/A";
  item_elem.career_time_elem.textContent = time_str || "N/A";
  item_elem.career_tech_elem.textContent = job.tech || "N/A";
  item_elem.career_resp_elem.innerHTML = Str_To_HTML(job.responsibilities || "N/A");
  item_elem.career_proj_elem.innerHTML = Str_To_HTML(job.projects || "N/A");

  item_elem.career_item_menu.addEventListener("edit", () => On_Click_Career_Edit(ctx, job_id));
  item_elem.career_item_menu.addEventListener("delete", (e) => On_Click_Delete_Career(e, job_id, ctx));
}

async function On_Click_Career_Edit(ctx, id)
{
  const curr_job = await ctx.Profile.Job_Select_By_Id(ctx, id);
  const form_data = await career_dialog.Show_Async(curr_job);
  if (form_data)
  {
    form_data.id = id;
    const is_saved = await ctx.Profile.Job_Save(ctx, form_data);
    if (is_saved)
    {
      await Render_Career(ctx);
      Alert("Job saved successfully.");
    }
    else
    {
      Alert("Failed to save job.");
    }
  }
}

async function On_Click_Delete_Career(e, id, ctx)
{
  const confirmed = await warning_dlg.Confirm("Are you sure you want to delete this job?");
  if (confirmed)
  {
    const is_deleted = await ctx.Profile.Job_Delete(ctx, id);
    if (is_deleted)
    {
      await Render_Career(ctx);
      Alert("Job deleted successfully.");
    }
    else
    {
      Alert("Failed to delete job.");
    }
  }
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

function Toggle_New_Agency_Fields()
{
  const is_new_agency = job_agency_select.value === "new";
  if (is_new_agency == undefined)
    is_new_agency = job_agency_select.value === "new";
  new_agency_label.hidden = !is_new_agency;
  new_agency_input.hidden = !is_new_agency;
}

function Toggle_New_Contact_Fields()
{
  const is_new_contact = job_contact_select.value === "new";
  if (is_new_contact == undefined)
    is_new_contact = job_contact_select.value === "new";
  contact_name_label.hidden = !is_new_contact;
  contact_name_input.hidden = !is_new_contact;
  contact_phone_label.hidden = !is_new_contact;
  contact_phone_input.hidden = !is_new_contact;
  contact_email_label.hidden = !is_new_contact;
  contact_email_input.hidden = !is_new_contact;
}

function Work_Type_Label(ctx, work_type)
{
  let res = null;

  if (work_type)
  {
    res = ctx.Job.work_types[work_type?.toLowerCase()] || work_type["other"];
  }

  return res;
}

function Str_To_HTML(str)
{
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML.replace(/\n/g, "<br>");
}

function Show_View(view_elem)
{
  jobs_list.classList.add("hidden");
  contacts_list.classList.add("hidden");
  companies_list.classList.add("hidden");
  profile_elem.classList.add("hidden");
  //marketing_body.classList.add("hidden");

  view_elem.classList.remove("hidden");
  //app_body.classList.remove("hidden");
}

function Duration_Str(start_time, end_time)
{
  let res = "";

  if (start_time && end_time)
  {
    const diff_ms = end_time - start_time;
    const diff_years = diff_ms / (1000 * 60 * 60 * 24 * 365);
    //res = diff_years.toFixed(1) + " years";

    res = diff_years.toLocaleString('en-US', 
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1
    }) + " years";
  }

  return res;
}

function Set_Options(select_elem, options, value_fn, text_fn)
{
  select_elem.innerHTML = '<option value="">None</option>';
  if (options)
  {
    for (const option of options)
    {
      const option_elem = document.createElement("option");
      option_elem.value = value_fn(option);
      option_elem.textContent = text_fn(option);
      select_elem.appendChild(option_elem);
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

// companies ======================================================================

async function Render_Companies(ctx)
{
  const companies = await ctx.Agency.Select(ctx);
  companies_list.value = companies;
}

async function On_Click_Delete_Company(e, agency_id, ctx)
{
  const confirmed = await warning_dlg.Confirm("Are you sure you want to delete this company?");
  if (confirmed)
  {
    const is_deleted = await ctx.Agency.Delete(ctx, agency_id);
    if (is_deleted)
    {
      await Render_Companies(ctx);
      Alert("Company deleted successfully.");
    }
    else
    {
      Alert("Failed to delete company.");
    }
  }
}

function Render_Company_Item(event, ctx)
{
  const item_elem = event.detail.item_elem;
  const agency = item_elem.item_obj;
  const agency_id = agency.id;

  item_elem.agency_name_elem.textContent = agency.name || "Unnamed Company";
  item_elem.agency_url_elem.textContent = agency.url || "No website";
  item_elem.agency_url_elem.href = agency.url || "#";
  item_elem.agency_phone_elem.textContent = agency.phone || "N/A";
  item_elem.agency_email_elem.textContent = agency.email || "N/A";
  item_elem.agency_address_elem.textContent = agency.address || "N/A";

  Toggle_Field(agency.industry, item_elem.agency_industry_elem, item_elem.agency_industry_field);

  item_elem.edit_company_btn.addEventListener("click", e => On_Click_Add_Company(e, agency_id, ctx));
  item_elem.del_company_btn.addEventListener("click", e => On_Click_Delete_Company(e, agency_id, ctx));
}

// contacts =======================================================================

async function On_Click_Edit_Job(event, job, ctx)
{
  job_agency_select.innerHTML = await ctx.Agency.Get_Options(ctx);
  Toggle_New_Agency_Fields(false);

  const form_data = await job_dialog.Show_Async(job);
  if (form_data)
  {
    form_data.id = job?.id;
    await ctx.Job.Save(ctx, form_data);
    await Render_Job_Items(ctx);
  }
}

async function On_Click_Add_Company(event, id, ctx)
{
  const curr_agency = await ctx.Agency.Select_By_Id(ctx, id);
  const form_data = await company_dialog.Show_Async(curr_agency);
  if (form_data)
  {
    form_data.id = id;
    const is_saved = await ctx.Agency.Save(ctx, form_data);
    if (is_saved)
    {
      await Render_Companies(ctx);
      Alert("Company saved successfully.");
    }
    else
    {
      Alert("Failed to save company.");
    }
  }
}

async function On_Click_Edit_Contact(event, ctx)
{
  const contact = event.detail;
  contact_dialog.agency_select.innerHTML = 
    await ctx.Agency.Get_Options(ctx);

  const msg_success = "Contact saved successfully.";
  const msg_fail = "Failed to save contact.";
  const form_data = await contact_dialog.Show(contact);
  const new_contact = 
    await Save_Obj
      (contact, form_data, c => ctx.Contact.Save(ctx, c), msg_success, msg_fail);
  if (new_contact)
  {
    contacts_list.Add(new_contact);
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

async function On_Click_Delete_Contact(event, ctx)
{
  const contact_id = event.detail.id;
  const confirmed = await warning_dlg.Confirm("Are you sure you want to delete this contact?");
  if (confirmed)
  {
    const is_deleted = await ctx.Contact.Delete(ctx, contact_id);
    if (is_deleted)
    {
      contacts_list.Remove(contact_id);
      Alert("Contact deleted successfully.");
    }
    else
    {
      Alert("Failed to delete contact.");
    }
  }
}

// jobs ===========================================================================

/**
 * @param {Context} ctx
 */
async function Render_Job_Items(ctx)
{
  jobs_list.value = await ctx.Job.Select_All_Extended_Sorted(ctx, jobs_filter.value);
}

function Render_Job_Item(event, ctx)
{
  const item_elem = event.detail.item_elem;
  const job = item_elem.item_obj;
  const job_id = job.id;
  //console.log("Render_Job_Item(): job =", job);

  const role_title = "#" + job.id + " " + job.role_title;
  const title_text = ctx.Utils.Append_Str(role_title, job.company, " - ");
  item_elem.role_title_elem.textContent = title_text;

  let subtitle_text = 
    ctx.Utils.Append_Str(job.contact?.name, job.agency_name, " @ ");
  subtitle_text = 
    ctx.Utils.Append_Str(subtitle_text, ctx.Job.Time_Since_Last_Update(job), " - ");
  item_elem.contact_elem.textContent = subtitle_text;

  const contact = { ...job.contact, agency_name: job.agency_name };
  item_elem.contact_details_elem.value = contact;

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
    await ctx.db2.Delete("attachments", [attachment.id]);
    await Render_Job_Items(ctx);
  }
}

async function On_Click_Download_Job(e, job_id, ctx)
{
  const job = await ctx.db2.Select_By_Id("jobs", job_id);

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
    await ctx.db2.Delete("jobs", [job_id]);
    const attachment_ids =
      await ctx.db2.Select_Ids("attachments", a => a.job_id === job_id);
    await ctx.db2.Delete("attachments", attachment_ids);
    const action_log_ids =
      await ctx.db2.Select_Ids("action_logs", l => l.job_id === job_id);
    await ctx.db2.Delete("action_logs", action_log_ids);

    await Render_Job_Items(ctx);
    Alert("Job deleted successfully.");
  }
}

function On_Click_Generate_CV(e, job_id, ctx)
{
  const url = "gen-cv-2.html?job_id=" + job_id;
  window.open(url, "_blank");
}

function On_Click_Generate_Cover_Letter(e, job_id, ctx)
{
  const url = "gen-cl.html?job_id=" + job_id;
  window.open(url, "_blank");
}

async function On_Click_View_Job(event, job_id, ctx)
{
  const curr_job = await ctx.db2.Select_By_Id("jobs", job_id);

  job_det_dialog.role_elem.innerText = curr_job.role_title;
  job_det_dialog.des_elem.innerText = curr_job.description || "No job description available.";

  const contact = await ctx.db2.Select_By_Id("contacts", curr_job.contact_id);
  const agency = await ctx.db2.Select_By_Id("agencies", curr_job.agency_id);
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

async function On_Click_Delete_Job_Contact(event)
{
  const contact = event.detail;
  job_contacts.contacts_list.Remove(contact);
}

async function On_Click_Add_Contact(event)
{
  const contact = await contact_dialog.Show();
  if (contact)
  {
    job_contacts.contacts_list.Add(contact);
  }
}

async function On_Click_Edit_Job_Contact(event, ctx)
{
  const contact = event.detail;
  contact_dialog.agency_select.innerHTML = 
    await ctx.Agency.Get_Options(ctx);

  const msg_success = "Contact saved successfully.";
  const msg_fail = "Failed to save contact.";
  const form_data = await contact_dialog.Show(contact);
  const new_contact = 
    await Save_Obj
      (contact, form_data, c => ctx.Contact.Save(ctx, c), msg_success, msg_fail);
  if (new_contact)
  {
    job_contacts.contacts_list.Add(contact);
  }
}

async function On_Click_Select_Contact(event, ctx)
{
  const contacts = await ctx.Contact.Select_Extended(ctx);
  const dlg_data = await contact_list_dialog.Show_Async({contacts});
  if (!ctx.Utils.Is_Empty(dlg_data?.contacts))
  {
    const contact = dlg_data.contacts[0];
    job_contacts.contacts_list.Add(contact);
  }
}
