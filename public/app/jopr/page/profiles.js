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
  const ctx = await New_Ctx();

  if (window.location.search)
  {
    jobs_btn.href = "index.html" + window.location.search;
  }

  Set_Options(career_work_type_select, Object.keys(ctx.Job.work_types), t => t, t => work_types[t]);

  import_btn.addEventListener("click", () => On_Click_Import_Btn(ctx));
  export_btn.onclick = () => On_Click_Export_Btn(ctx);

  await Render_Profile(ctx);
  await Render_Education(ctx);
  await Render_Career(ctx);

  project_list.save_fn = project => ctx.Project.Save(ctx, project);
  project_list.delete_fn = project_id => ctx.Project.Delete(ctx, project_id);
  project_list.addEventListener("alert", e => Alert(e.detail));
  const projects = await ctx.Project.Select(ctx);
  project_list.value = projects;

  Update_Chart(ctx);

  const url_params = new URLSearchParams(window.location.search);
  if (url_params.get("action") === "ai")
  {
    On_Click_AI_Add_Profile(ctx);
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
    await Update_Profile(ctx);
    await Update_Education(ctx);
    await Update_Career(ctx);
    const projects = await ctx.Project.Select(ctx);
    project_list.value = projects;
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
  const query_id = query.id;
  const one_week_ago = Date.now() - (ctx.Utils.MILLIS_WEEK * 4);
  const data = await Stats.Trend.Select_By_Query_Id(query_id);
  const recent_data = data.filter(d => d.datetime >= one_week_ago);
  if (recent_data && recent_data.length > 0)
  {
    const chart_data = recent_data.map(t => { return { x: t.datetime, y: t.count } });
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
      chart_elem.svg.classList.add("trend-up");
    }
    else if (percent_change < 0)
    {
      chart_elem.svg.classList.add("trend-down");
    }
    else
    {
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

function Duration_Str(start_time, end_time)
{
  let res = "";

  if (start_time && end_time)
  {
    const diff_ms = end_time - start_time;
    const diff_years = diff_ms / (1000 * 60 * 60 * 24 * 365);

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
  if (select_elem)
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

// profile ========================================================================

async function Render_Profile(ctx)
{
  profile_menu.addEventListener("add", () => On_Click_Edit_Profile(ctx, null));
  profile_menu.addEventListener("ai", () => On_Click_AI_Add_Profile(ctx));
  profile_menu.addEventListener("download", () => On_Click_Download_Profile(ctx));
  profile_list.addEventListener("render", (e) => Render_Profile_Item(e, ctx));
  await Update_Profile(ctx);
}

async function Update_Profile(ctx)
{
  const profiles = await ctx.Profile.Select_All(ctx);
  profile_list.value = profiles;
}

function Render_Profile_Item(event, ctx)
{
  const item_elem = event.detail.item_elem;
  const profile = item_elem.item_obj;
  const profile_id = profile.id;

  item_elem.profile_title_elem.textContent = profile.title || profile.name || "Untitled Profile";
  item_elem.profile_name_elem.textContent = profile.name ? `(${profile.name})` : "";
  
  if (profile.active)
  {
    item_elem.status_elem.textContent = "Active";
    item_elem.status_elem.style.display = null;
    item_elem.open = true;
  }
  else
  {
    item_elem.status_elem.textContent = "";
    item_elem.status_elem.style.display = "none";
  }

  item_elem.profile_name_det.textContent = profile.name || "N/A";
  item_elem.profile_email_elem.textContent = profile.email || "N/A";
  item_elem.profile_phone_elem.textContent = profile.phone || "N/A";
  item_elem.profile_address_elem.textContent = profile.address || "N/A";
  item_elem.profile_url_elem.textContent = profile.url || "N/A";
  item_elem.profile_seek_url_elem.textContent = profile.seek_url || "N/A";
  item_elem.profile_linkedin_url_elem.textContent = profile.linkedin_url || "N/A";
  item_elem.profile_residency_status_elem.textContent = profile.residency_status || "N/A";
  item_elem.profile_personal_summary_elem.innerHTML = Str_To_HTML(profile.personal_summary || "N/A");
  item_elem.profile_skills_elem.textContent = Array.isArray(profile.skills) ? profile.skills.join(", ") : (profile.skills || "N/A");
  item_elem.profile_interests_elem.innerHTML = Str_To_HTML(Array.isArray(profile.interests) ? profile.interests.join(", ") : (profile.interests || "N/A"));

  item_elem.profile_item_menu.addEventListener("edit", () => On_Click_Edit_Profile(ctx, profile_id));
  item_elem.profile_item_menu.addEventListener("delete", () => On_Click_Delete_Profile(ctx, profile_id));
  item_elem.profile_item_menu.addEventListener("download", () => On_Click_Download_Profile(ctx, profile_id));
}

async function On_Click_Edit_Profile(ctx, id)
{
  const profile = id ? await ctx.Profile.Select_By_Id(ctx, id) : (id === null ? null : await ctx.Profile.Select_First(ctx));
  const form_data = await profile_form.Show_Async(profile);
  if (form_data)
  {
    form_data.id = id || (id === null ? undefined : profile?.id);
    const is_saved = await ctx.Profile.Save(ctx, form_data);
    if (is_saved)
    {
      await Update_Profile(ctx);
      await Update_Education(ctx);
      await Update_Career(ctx);
      Alert("Profile saved successfully.");
    }
    else
    {
      Alert("Failed to save profile.");
    }
  }
}

async function On_Click_AI_Add_Profile(ctx)
{
  const files = await ctx.Utils.Select_Files();
  if (files && files.length > 0) 
  {
    info_elem.Info("Reading CV...");
    const cv_blob = files[0];
    const cv_data = await ctx.ai.Extract_CV(cv_blob, info_elem.Info);

    info_elem.Info("Saving CV data...");
    if (cv_data.profile)
    {
      cv_data.profile.active = true;
      cv_data.profile.title = cv_data.profile.title || cv_data.profile.name || "Main Profile";
      await ctx.db.Clear_Table(ctx.Profile.table_name);
      await ctx.Profile.Save(ctx, cv_data.profile);
    }
    await ctx.db.Clear_Table(ctx.Profile.edu_table_name);
    await ctx.db.Insert_Items(ctx.Profile.edu_table_name, cv_data.educations);
    await ctx.db.Clear_Table(ctx.Profile.job_table_name);
    await ctx.db.Insert_Items(ctx.Profile.job_table_name, cv_data.career);

    info_elem.Info();
    Alert("CV extracted successfully!");
    await Update_Profile(ctx);
    await Update_Education(ctx);
    await Update_Career(ctx);
  }
}

async function On_Click_Download_Profile(ctx, id)
{
  const employee_profile = id ? await ctx.Profile.Select_By_Id(ctx, id) : await ctx.Profile.Select_First(ctx);
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

  const filename = `jopr-profile-${employee_profile?.title || employee_profile?.name || 'profile'}-${new Date().toISOString().split('T')[0]}.json`;
  const json_string = JSON.stringify(employee, null, 2);
  const blob = new Blob([json_string], { type: 'application/json' });
  ctx.Utils.Download_File(blob, filename);

  Alert("Data exported successfully!");
}

async function On_Click_Delete_Profile(ctx, id)
{
  const confirmed = await warning_dlg.Confirm("Are you sure you want to delete this profile?");
  if (confirmed)
  {
    const is_deleted = await ctx.Profile.Delete(ctx, id);
    if (is_deleted)
    {
      await Update_Profile(ctx);
      await Update_Education(ctx);
      await Update_Career(ctx);
      Alert("Profile deleted successfully.");
    }
    else
    {
      Alert("Failed to delete profile.");
    }
  }
}

// education ======================================================================

async function Render_Education(ctx)
{
  edu_list_menu.addEventListener("add", (e) => On_Click_Update_Edu(e, null, ctx));
  edu_list.addEventListener("render", (e) => Render_Edu_Item(e, ctx));
  await Update_Education(ctx);
}

async function Update_Education(ctx)
{
  const certificates = await ctx.Profile.Edu_Select_Active(ctx);
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
      await Update_Education(ctx);
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
      await Update_Education(ctx);
      Alert("Certificate deleted successfully.");
    }
    else
    {
      Alert("Failed to delete certificate.");
    }
  }
}

// career =========================================================================

async function Render_Career(ctx)
{
  career_list_menu.addEventListener("add", (e) => On_Click_Career_Edit(ctx, null));
  career_list.addEventListener("render", (e) => Render_Career_Item(ctx, e));
  await Update_Career(ctx);
}

async function Update_Career(ctx)
{
  const jobs = await ctx.Profile.Job_Select_Active(ctx);
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
      await Update_Career(ctx);
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
      await Update_Career(ctx);
      Alert("Job deleted successfully.");
    }
    else
    {
      Alert("Failed to delete job.");
    }
  }
}
