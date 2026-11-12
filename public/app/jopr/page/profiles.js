import New_Ctx from "../lib/ctx.js?v=2";
import * as Stats from "../../job-woper/lib/index.js?v=2";
import DB_SCHEMA from "../db/schema.js?v=2";

Main();

/**
 * Initializes the profiles management page.
 *
 * @returns {Promise<void>}
 */
async function Main()
{
  const ctx = await New_Ctx();

  if (window.location.search)
  {
    jobs_btn.href = "index.html" + window.location.search;
  }

  import_btn.addEventListener("click", () => On_Click_Import_Btn(ctx));
  export_btn.onclick = () => On_Click_Export_Btn(ctx);

  await Render_Profile(ctx);

  Update_Chart(ctx);

  if (ctx.Utils.Get_Param("action") === "ai")
  {
    On_Click_AI_Add_Profile(ctx);
  }
}

/**
 * Handles importing a JSON database backup into IndexedDB.
 *
 * @param {import("../lib/ctx.js").Context} ctx - Application context.
 * @returns {Promise<void>}
 */
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
    Alert("Data imported from " + file.name + " to IndexedDB instance.");
  };

  input.click();
}

/**
 * Handles exporting all IndexedDB tables as a JSON file.
 *
 * @param {import("../lib/ctx.js").Context} ctx - Application context.
 * @returns {Promise<void>}
 */
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

/**
 * Updates the market trend chart in the header.
 *
 * @param {import("../lib/ctx.js").Context} ctx - Application context.
 * @returns {Promise<void>}
 */
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

/**
 * Escapes text content and converts newlines to `<br>` tags.
 *
 * @param {string} str - Input string.
 * @returns {string} HTML string.
 */
function Str_To_HTML(str)
{
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML.replace(/\n/g, "<br>");
}

/**
 * Calculates and formats a duration string in years between two dates.
 *
 * @param {Date|number|null} start_time - Start date/timestamp.
 * @param {Date|number|null} end_time - End date/timestamp.
 * @returns {string}
 */
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

/**
 * Displays an animated status alert in `alert_elem`.
 *
 * @param {string} msg - Alert message text.
 */
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

/**
 * Initializes the profile list component and toolbar listeners.
 *
 * @param {import("../lib/ctx.js").Context} ctx - Application context.
 * @returns {Promise<void>}
 */
async function Render_Profile(ctx)
{
  profile_menu.addEventListener("add", () => On_Click_Add_Profile(ctx));
  profile_menu.addEventListener("ai", () => On_Click_AI_Add_Profile(ctx));
  profile_menu.addEventListener("download", () => On_Click_Download_Profile(ctx));
  profile_list.addEventListener("render", (e) => Render_Profile_Item(e, ctx));
  await Update_Profile(ctx);
}

/**
 * Fetches all profiles and updates `profile_list`.
 *
 * @param {import("../lib/ctx.js").Context} ctx - Application context.
 * @returns {Promise<void>}
 */
async function Update_Profile(ctx)
{
  const profiles = await ctx.Profile.Select_All(ctx);
  profile_list.value = profiles;
}

/**
 * Renders a profile item along with its read-only education, career, and projects summary lists.
 *
 * @param {CustomEvent} event - The `de-input-list` render event.
 * @param {import("../lib/ctx.js").Context} ctx - Application context.
 * @returns {Promise<void>}
 */
async function Render_Profile_Item(event, ctx)
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
  item_elem.profile_item_menu.addEventListener("copy", () => On_Click_Copy_Profile(ctx, profile_id));
  item_elem.profile_item_menu.addEventListener("delete", () => On_Click_Delete_Profile(ctx, profile_id));
  item_elem.profile_item_menu.addEventListener("download", () => On_Click_Download_Profile(ctx, profile_id));

  item_elem.edu_list.addEventListener("render", Render_Edu_Item);
  const certificates = await ctx.Profile.Edu_Select(ctx, c => c.profile_id == profile_id);
  item_elem.edu_list.value = certificates;

  item_elem.career_list.addEventListener("render", (e) => Render_Career_Item(ctx, e));
  const jobs = await ctx.Profile.Job_Select(ctx, j => j.profile_id == profile_id);
  item_elem.career_list.value = jobs;

  item_elem.project_list.addEventListener("render", Render_Project_Item);
  const projects = await ctx.Project.Select(ctx);
  item_elem.project_list.value = projects;
}

/**
 * Renders a read-only education item inside a profile's education list.
 *
 * @param {CustomEvent} event - The `de-input-list` render event.
 */
function Render_Edu_Item(event)
{
  const item_elem = event.detail.item_elem;
  const edu = item_elem.item_obj;

  item_elem.edu_title_elem.textContent = edu.title || "Unnamed Education";
  item_elem.edu_institution_elem.textContent = edu.institution || "N/A";
  item_elem.edu_year_elem.textContent = edu.year || "N/A";
}

/**
 * Renders a read-only career item inside a profile's career list.
 *
 * @param {import("../lib/ctx.js").Context} ctx - Application context.
 * @param {CustomEvent} event - The `de-input-list` render event.
 */
function Render_Career_Item(ctx, event)
{
  const item_elem = event.detail.item_elem;
  const job = item_elem.item_obj;

  const start_time = job.start_date ? new Date(job.start_date) : null;
  const start_time_str = ctx.Utils.To_Date_Str(start_time);
  const end_time = job.end_date ? new Date(job.end_date) : null;
  const end_time_str = ctx.Utils.To_Date_Str(end_time);
  const duration_str = Duration_Str(start_time, end_time);
  let time_str = ctx.Utils.Append_Str(start_time_str, end_time_str, " - ");
  time_str = ctx.Utils.Append_Str(time_str, duration_str ? "(" + duration_str + ")" : null, " ");

  item_elem.career_company_elem.textContent = job.company_name || "N/A";
  item_elem.career_title_elem.textContent = job.role_titles || "N/A";
  item_elem.career_time_elem.textContent = time_str || "N/A";
}

/**
 * Renders a read-only project item inside a profile's project list.
 *
 * @param {CustomEvent} event - The `de-input-list` render event.
 */
function Render_Project_Item(event)
{
  const item_elem = event.detail.item_elem;
  const project = item_elem.item_obj;

  item_elem.project_title_elem.textContent = project.title || "N/A";
  item_elem.project_url_elem.textContent = project.url || "N/A";
}

/**
 * Opens the dialog form to create a new profile.
 *
 * @param {import("../lib/ctx.js").Context} ctx - Application context.
 * @returns {Promise<void>}
 */
async function On_Click_Add_Profile(ctx)
{
  const form_data = await profile_form.Show_Async(null);
  if (form_data)
  {
    const is_saved = await ctx.Profile.Save(ctx, form_data);
    if (is_saved)
    {
      await Update_Profile(ctx);
      Alert("Profile saved successfully.");
    }
    else
    {
      Alert("Failed to save profile.");
    }
  }
}

/**
 * Opens the single profile edit page in a new tab for the selected profile ID.
 *
 * @param {import("../lib/ctx.js").Context} ctx - Application context.
 * @param {number|string} id - Profile ID to edit.
 */
function On_Click_Edit_Profile(ctx, id)
{
  window.open(ctx.routes.profile(id), "_blank");
}

/**
 * Extracts CV data using AI and saves the extracted profile, education, and career records.
 *
 * @param {import("../lib/ctx.js").Context} ctx - Application context.
 * @returns {Promise<void>}
 */
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
  }
}

/**
 * Downloads the selected profile along with education and career history as a JSON file.
 *
 * @param {import("../lib/ctx.js").Context} ctx - Application context.
 * @param {number|string} [id] - Profile ID to export.
 * @returns {Promise<void>}
 */
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

/**
 * Confirms and deletes a profile.
 *
 * @param {import("../lib/ctx.js").Context} ctx - Application context.
 * @param {number|string} id - Profile ID to delete.
 * @returns {Promise<void>}
 */
async function On_Click_Delete_Profile(ctx, id)
{
  const confirmed = await warning_dlg.Confirm("Are you sure you want to delete this profile?");
  if (confirmed)
  {
    const is_deleted = await ctx.Profile.Delete(ctx, id);
    if (is_deleted)
    {
      await Update_Profile(ctx);
      Alert("Profile deleted successfully.");
    }
    else
    {
      Alert("Failed to delete profile.");
    }
  }
}

/**
 * Duplicates an existing profile and refreshes the list.
 *
 * @param {import("../lib/ctx.js").Context} ctx - Application context.
 * @param {number|string} id - Profile ID to copy.
 * @returns {Promise<void>}
 */
async function On_Click_Copy_Profile(ctx, id)
{
  const new_profile_id = await ctx.Profile.Copy(ctx, id);
  if (new_profile_id)
  {
    await Update_Profile(ctx);
    Alert("Profile copied successfully.");
  }
  else
  {
    Alert("Failed to copy profile.");
  }
}

