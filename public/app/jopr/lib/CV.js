import * as fb_app from "firebase/app";
import * as fb_ai from "firebase/ai";
import DB_SCHEMA from "../db/schema.js";
import Utils from "../../../lib/Utils.js";
import Db from "../lib/Db.js";
import AI from "../lib/AI.js";
import Profile from "../lib/Profile.js";
import Job from "../lib/Job.js";

Main2();
async function Main2()
{
  const ctx =
  {
    ai: await AI.New(fb_app, fb_ai),
    db: await Db.New(DB_SCHEMA),
    db2: await Db.New(DB_SCHEMA),
    Profile, Utils, Job
  };

  const url_params = new URLSearchParams(window.location.search);
  const gen = url_params.has("gen", true);

  const job_id_str = url_params.get("job_id");
  const job_id = Utils.Is_Empty(job_id_str) ? null : parseInt(job_id_str);
  const job = await ctx.Job.Select_By_Id(ctx, job_id);

  if (gen || !job.cv)
  {
    job.cv = await Generate_CV(ctx, job);
    await ctx.Job.Save(ctx, job);
  }

  Render_CV(job, ctx);
  document.body.style.opacity = "1";
}

// events =========================================================================

function On_Change_Job_Title(event)
{
  const edit_elem = event.currentTarget;
  const edit_value = edit_elem.value;
  const ctx = edit_value.ctx;
  edit_value.cv_job.role_titles = edit_value.text;
  edit_value.cv_job.role_title = null;

  ctx.Job.Save(ctx, edit_value.target_job);
}

// business logic =================================================================

/**
 * @param {Context} ctx
 * @param {object} prospective_job
 */
async function Generate_CV(ctx, prospective_job)
{
  let cv = {};

  cv.profile = await ctx.Profile.Select(ctx);
  if (cv.profile && ctx.ai)
  {
    info_elem.Info("Generating CV...");
    await Utils.sleep(1500);

    info_elem.Info("Generating profile...");
    cv.summ_text = await ctx.ai.Generate_Summary(prospective_job, cv.profile);

    info_elem.Info("Generating skills list...");
    cv.career_jobs = await ctx.Profile.Job_Select(ctx);
    cv.skills = await ctx.ai.Generate_Skills(prospective_job, cv.career_jobs, cv.profile);

    info_elem.Info("Selecting jobs...");
    const best_job_ids = await ctx.ai.Select_Best_Jobs(cv.career_jobs, prospective_job);
    if (best_job_ids)
    {
      cv.best_jobs = cv.career_jobs.filter(j => best_job_ids.includes(j.id));
      for (const job of cv.best_jobs)
      {
        info_elem.Info("Generating " + job.company_name + " job title...");
        job.role_title = await ctx.ai.Generate_Job_Title(job, prospective_job);

        info_elem.Info("Generating " + job.company_name + " job description...");
        job.tailored_job = await ctx.ai.Generate_Job_Description(job, prospective_job);
      }
    }

    info_elem.Info("Adding previous jobs...");
    cv.legacy_jobs = await ctx.Profile.Job_Select_Legacy(ctx, best_job_ids);

    info_elem.Info("Adding education...");
    cv.edu_items = await ctx.Profile.Edu_Select(ctx);

    info_elem.Info();
  }

  return cv;
}

function Get_Next_Job(job, all_jobs)
{
  let res = null;

  const jobs_after = all_jobs.filter(j => j.start_date > job.start_date);
  if (!Utils.Is_Empty(jobs_after))
  {
    let min_job = jobs_after[0];
    let min_dt = min_job.start_date - job.start_date;
    for (const job_after of jobs_after)
    {
      const dt = job_after.start_date - job.start_date;
      if (dt < min_dt)
      {
        min_dt = dt;
        min_job = job_after;
      }
    }
    res = min_job;
  }

  return res;
}

// render lists ===================================================================

// render list item ===============================================================

function Render_Legacy_Job_Item(event, all_jobs)
{
  const item_elem = event.detail.item_elem;
  const job = item_elem.item_obj;

  const date_info = Render_Date_Strs(job, all_jobs);

  item_elem.job_title.innerText = job.role_titles;
  item_elem.job_company.innerText = job.company_name;
  item_elem.dates.innerText = date_info.start_date_str;
}

async function Render_Job_Item2(event, target_job, ctx)
{
  const all_jobs = target_job.cv.best_jobs;
  const item_elem = event.detail.item_elem;
  const job = item_elem.item_obj;

  const date_info = Render_Date_Strs(job, all_jobs);
  item_elem.dates.innerText =
    date_info.start_date_str; // + " (" + date_info.duration_str + ")";

  item_elem.job_title.addEventListener("change", On_Change_Job_Title);
  const value =
  {
    ctx,
    target_job,
    cv_job: job,
    text: job.role_title?.suggested_title || job.role_titles,
    original_text: job.role_titles
  };
  item_elem.job_title.value = value;

  item_elem.job_description.innerText = job.tailored_job.summary;
  const html = Render_List(job.tailored_job.bullet_points);
  if (html)
    item_elem.job_points.innerHTML = html;
  else
    item_elem.job_points.style.display = "none";

  item_elem.job_company.innerText = job.company_name;
  item_elem.job_tech.innerText = job.tech;
}

function Render_Education_Item(event)
{
  const item_elem = event.detail.item_elem;
  const education = item_elem.item_obj;

  item_elem.edu_title.innerText = education.title;
  item_elem.edu_institution.innerText = education.institution;
}

// rendering ======================================================================

function Render_CV(job, ctx)
{
  const cv = job.cv;

  prof_name.innerText = cv.profile.name;
  Render_Field(prof_email_field, cv.profile.email);
  Render_Field(prof_phone_field, cv.profile.phone);
  Render_Field(prof_address_field, cv.profile.address);
  Render_Field(prof_residency_field, cv.profile.residency_status);
  Render_Field(prof_website_field, cv.profile.url);

  const seek_html = `<a href="${cv.profile.seek_url}" target="_blank">Seek Profile</a>`;
  const linkedin_html = `<a href="${cv.profile.linkedin_url}" target="_blank">LinkedIn</a>`;
  //const links_html = Utils.Append_Str(seek_html, linkedin_html, " | ");
  //Render_Field(prof_links_field, links_html);
  Render_Field(prof_links_field, null);

  summ_value.innerText = cv.summ_text || "Unable to generate.";

  skills_value.innerHTML = Render_List(cv.skills);

  if (cv.best_jobs)
  {
    jobs_list.addEventListener("render", e => Render_Job_Item2(e, job, ctx));
    jobs_list.value = cv.best_jobs;

    const job_elems = jobs_list.querySelectorAll("[slot=item]");
    job_elems[0].style.padding = "0";
  }

  if (cv.legacy_jobs)
  {
    legacy_jobs_list.addEventListener("render", e => Render_Legacy_Job_Item(e, cv.legacy_jobs));
    legacy_jobs_list.value = cv.legacy_jobs;
  }

  education_list.addEventListener("render", Render_Education_Item);
  education_list.value = cv.edu_items;
}

function Render_Date_Strs(job, all_jobs)
{
  const start_date = job.start_date;
  const next_job = Get_Next_Job(job, all_jobs);
  const end_date = next_job ? next_job.start_date : job.end_date;
  const duration_str = Duration_Str(start_date, end_date);
  const start_date_str = Render_Date(start_date);

  return { start_date_str, duration_str };
}

function Render_Date(date_ms)
{
  let res = "";

  if (date_ms)
  {
    const date = new Date(date_ms);
    const month_name = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    res = month_name + " " + year;
  }

  return res;
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
