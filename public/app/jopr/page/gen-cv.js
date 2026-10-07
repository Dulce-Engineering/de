import Utils from "../../../lib/Utils.js?v=2";
import AI from "../lib/AI.js?v=2";
import New_Ctx from "../lib/ctx.js?v=2";

Main2();
async function Main2()
{
  const ctx = await New_Ctx();

  const url_params = new URLSearchParams(window.location.search);
  const gen = url_params.get("gen") == "true";
  const ignore_titles = url_params.get("ignore_titles") == "true";

  const job_id_str = url_params.get("job_id");
  const job_id = Utils.Is_Empty(job_id_str) ? null : parseInt(job_id_str);
  const job = await ctx.Job.Select_By_Id(ctx, job_id);

  const profile_id_str = url_params.get("profile_id");
  const profile_id = Utils.Is_Empty(profile_id_str) ? null : parseInt(profile_id_str);
  let profile = await ctx.Profile.Select_By_Id(ctx, profile_id);
  if (!profile)
    profile = await ctx.Profile.Select_Active(ctx);

  if (gen || !job.cv)
  {
    job.cv = await ctx.ai.Generate_CV(ctx, job, profile, info_elem.Info, { ignore_titles });
    await ctx.Job.Save(ctx, job);
  }

  await Render_CV(job, ctx);
  document.body.style.opacity = "1";
}

// events =========================================================================

function On_Change_Job_Title(event)
{
  const edit_value = event.currentTarget.value;
  edit_value.cv_job.role_titles = edit_value.text;
  edit_value.cv_job.role_title = null;

  const ctx = edit_value.ctx;
  ctx.Job.Save(ctx, edit_value.target_job);
}

function On_Change_Job_Date(event)
{
  const edit_value = event.currentTarget.value;
  // update cv job with new entered date string
  edit_value.cv_job.tailored_date_str = edit_value.text;

  const ctx = edit_value.ctx;
  ctx.Job.Save(ctx, edit_value.target_job);
}

function On_Change_Job_Summary(event)
{
  const edit_value = event.currentTarget.value;
  edit_value.cv_job.tailored_job.summary = edit_value.text;

  const ctx = edit_value.ctx;
  ctx.Job.Save(ctx, edit_value.target_job);
}

function On_Change_Job_Tech(event)
{
  const edit_value = event.currentTarget.value;
  edit_value.cv_job.tech = edit_value.text;

  const ctx = edit_value.ctx;
  ctx.Job.Save(ctx, edit_value.target_job);
}

function On_Change_Personal_Summary(event)
{
  const edit_value = event.currentTarget.value;
  edit_value.target_job.cv.summ_text = edit_value.text;

  const ctx = edit_value.ctx;
  ctx.Job.Save(ctx, edit_value.target_job);
}

function On_Click_Vis_Btn(event)
{
  const vis_btn = event.currentTarget;
  const cv_job = vis_btn.item_elem.item_obj;
  cv_job.is_visible = !CV_Job_Is_Visible(cv_job);
  Render_Vis_State(vis_btn, cv_job.is_visible);

  const ctx = vis_btn.ctx;
  ctx.Job.Save(ctx, vis_btn.target_job);
}

// business logic =================================================================

function CV_Job_Is_Visible(cv_job)
{
  return cv_job.is_visible === null || 
    cv_job.is_visible === undefined || 
    cv_job.is_visible === true;
}

// render lists ===================================================================

// render list item ===============================================================

async function Render_Job_Item(event, target_job, ctx)
{
  const all_jobs = target_job.cv.legacy_jobs;
  const best_jobs = target_job.cv.best_jobs;
  const item_elem = event.detail.item_elem;
  let job = item_elem.item_obj;

  Render_Vis_Buttons(ctx, item_elem, target_job);
  AI.Render_Date_Strs(job, all_jobs);

  const best_job_index = best_jobs.findIndex(j => j.id == job.id);
  if (best_job_index > -1)
  {
    const cv_job = best_jobs[best_job_index];
    item_elem.dates.value =
    {
      ctx, target_job, cv_job,
      text: cv_job.tailored_date_str || job.date_info.range_str,
      original_text: job.date_info.range_str
    };
    item_elem.dates.addEventListener("change", On_Change_Job_Date);

    let value =
    {
      ctx, target_job, cv_job,
      text: cv_job.role_title?.suggested_title || cv_job.role_titles,
      original_text: cv_job.role_titles
    };
    item_elem.job_title.value = value;
    item_elem.job_title.addEventListener("change", On_Change_Job_Title);

    value =
    {
      ctx, target_job, cv_job,
      text: cv_job.tailored_job.summary,
      original_text: cv_job.responsibilities
    };
    item_elem.job_description.value = value;
    item_elem.job_description.addEventListener("change", On_Change_Job_Summary);

    const html = Render_List(cv_job.tailored_job.bullet_points);
    if (html)
      item_elem.job_points.innerHTML = html;
    else
      item_elem.job_points.style.display = "none";

    item_elem.job_company.innerText = cv_job.company_name;

    value =
    {
      ctx, target_job, cv_job,
      text: cv_job.tech,
      original_text: job.tech
    };
    item_elem.job_tech.value = value;
    item_elem.job_tech.addEventListener("change", On_Change_Job_Tech);

    item_elem.legacy_job.hidden = true;
  }
  else
  {
    item_elem.classList.add("legacy");
    item_elem.legacy_job_title.innerText = job.role_titles;
    item_elem.legacy_job_company.innerText = job.company_name;
    item_elem.legacy_tech.innerText = "Tech: " + job.tech;
    item_elem.legacy_dates.innerText = job.date_info.range_str + " *";

    item_elem.best_job.hidden = true;
  }
}

function Render_Vis_Buttons(ctx, item_elem, target_job)
{
  const vis_btn_html = `
    <button type="button" class="vis-btn">
      <img cid="vis_on_img" src="/app/jopr/image/black/visibility.svg" style="display:none;">
      <img cid="vis_off_img" src="/app/jopr/image/black/visibility-off.svg">
    </button>
  `;
  item_elem.insertAdjacentHTML('afterend', vis_btn_html);
  const vis_btn = item_elem.nextElementSibling;
  vis_btn.ctx = ctx;
  vis_btn.item_elem = item_elem;
  vis_btn.target_job = target_job;
  vis_btn.addEventListener("click", On_Click_Vis_Btn);

  const cv_job = vis_btn.item_elem.item_obj;
  Render_Vis_State(vis_btn, CV_Job_Is_Visible(cv_job));
}

function Render_Education_Item(event)
{
  const item_elem = event.detail.item_elem;
  const education = item_elem.item_obj;

  item_elem.edu_title.innerText = education.title;
  item_elem.edu_institution.innerText = education.institution;
}

function Render_Project_Item(event)
{
  const item_elem = event.detail.item_elem;
  const project = item_elem.item_obj;

  item_elem.project_title.innerText = project.title;
  item_elem.project_description.innerText = project.description;
  item_elem.project_tech.innerText = project.tech;
  item_elem.project_url.innerText = project.url;
  item_elem.project_url.href = project.url;
}

// rendering ======================================================================

function Render_Vis_State(vis_btn, is_visible)
{
  const vis_on_img = vis_btn.querySelector("[cid=vis_on_img]");
  const vis_off_img = vis_btn.querySelector("[cid=vis_off_img]");
  const item_elem = vis_btn.item_elem;

  if (!is_visible)
  {
    item_elem.style.display = "none";
    vis_on_img.style.display = "";
    vis_off_img.style.display = "none";
    vis_btn.classList.add("vis-on");
  }
  else
  {
    item_elem.style.display = "";
    vis_on_img.style.display = "none";
    vis_off_img.style.display = "";
    vis_btn.classList.remove("vis-on");
  }
}

async function Render_CV(job, ctx)
{
  const cv = job.cv;

  document.title = "CV-" + await ctx.Job.Get_Org_Name(ctx, job);

  prof_name.innerText = cv.profile.name;
  Render_Field(prof_email_field, cv.profile.email);
  Render_Field(prof_phone_field, cv.profile.phone);
  Render_Field(prof_address_field, cv.profile.address);
  Render_Field(prof_residency_field, cv.profile.residency_status);
  Render_Field(prof_website_field, cv.profile.url);
  Render_Field(prof_ref_field, "Ref# " + job.id);

  const seek_html = `<a href="${cv.profile.seek_url}" target="_blank">Seek Profile</a>`;
  const linkedin_html = `<a href="${cv.profile.linkedin_url}" target="_blank">LinkedIn</a>`;
  //const links_html = Utils.Append_Str(seek_html, linkedin_html, " | ");
  //Render_Field(prof_links_field, links_html);
  Render_Field(prof_links_field, null);

  summ_value.addEventListener("change", On_Change_Personal_Summary);
  const summ_data = 
  { 
    ctx,
    target_job: job,
    text: cv.summ_text,
  };
  summ_value.value = summ_data;

  skills_value.innerHTML = Render_List(cv.skills);

  if (cv.legacy_jobs)
  {
    jobs_list.addEventListener("render", e => Render_Job_Item(e, job, ctx));
    jobs_list.value = cv.legacy_jobs;

    const job_elems = jobs_list.querySelectorAll("[slot=item]");
    job_elems[0].style.padding = "0";
  }

  if (cv.projects)
  {
    projects_article.style.display = null;
    projects_list.addEventListener("render", Render_Project_Item);
    projects_list.value = cv.projects;
  }

  education_list.addEventListener("render", Render_Education_Item);
  education_list.value = cv.edu_items;
}

function Render_List(items)
{
  let html = null;

  if (Array.isArray(items))
  {
    html = "";
    for (const item of items)
    {
      html += `<li>${item}</li>`;
    }
    html = `<ul>${html}</ul>`;
  }

  return html;
}

function Render_Field(field_elem, value)
{
  if (!Utils.Is_Empty(value))
  {
    const field_value_elem = field_elem.querySelector("dd");
    field_value_elem.innerHTML = value;
  }
  else
  {
    field_elem.style.display = "none";
  }
}
