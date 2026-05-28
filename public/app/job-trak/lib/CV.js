import * as fb_app from "firebase/app";
import * as fb_ai from "firebase/ai";
import DB_SCHEMA from "../db/schema.js";
import Utils from "../../../lib/Utils.js";
import Db from "../lib/Db.js";
import AI from "../lib/AI.js";
/*import "../../../dedial/dedial.js";
import "../../../component/DeInputList/index3.js";
import "../../../component/DeForm/index.js";
import "../../../component/DeDialogForm/index.js";
import "../../../component/DeDialogAlert/index.js";
import "../../../component/DeDialogConfirm/index.js";
import "../component/DeToolbarMenu/index.js";
import "../component/DeInfo/index.js";*/

Main();
async function Main()
{
  const ctx =
  {
    ai: await AI.New(fb_app, fb_ai),
    db: await Db.New(DB_SCHEMA),
  };

  const profiles = await ctx.db.Get_All("profiles");
  const profile = !Utils.Is_Empty(profiles) ? profiles[0] : null;
  if (profile)
  {
    info_elem.Info("Generating CV...");
    await Utils.sleep(1500);

    prof_name.innerText = profile.name;
    Render_Field(prof_email_field, profile.email);
    Render_Field(prof_phone_field, profile.phone);
    Render_Field(prof_address_field, profile.address);
    Render_Field(prof_residency_field, profile.residency_status);
    Render_Field(prof_website_field, profile.url);

    const seek_html = `<a href="${profile.seek_url}" target="_blank">Seek Profile</a>`;
    const linkedin_html = `<a href="${profile.linkedin_url}" target="_blank">LinkedIn</a>`;
    const links_html = Utils.Append_Str(seek_html, linkedin_html, " | ");
    //Render_Field(prof_links_field, links_html);
    Render_Field(prof_links_field, null);

    const job_id_str = new URLSearchParams(window.location.search).get("job_id");
    const job_id = Utils.Is_Empty(job_id_str) ? null : parseInt(job_id_str);
    const prospective_job = await ctx.db.Select_By_Id("jobs", job_id);

    info_elem.Info("Generating profile...");
    const summ_text = await ctx.ai.Generate_Summary(prospective_job, profile);
    summ_value.innerText = summ_text || "Unable to generate.";

    info_elem.Info("Generating skills list...");
    const career_jobs = await ctx.db.Get_All("career");
    const skills = await ctx.ai.Generate_Skills(prospective_job, career_jobs, profile);
    skills_value.innerHTML = Render_List(skills);

    info_elem.Info("Selecting jobs...");
    const best_job_ids = await ctx.ai.Select_Best_Jobs(career_jobs, prospective_job);
    if (best_job_ids)
    {
      const best_jobs = career_jobs.filter(j => best_job_ids.includes(j.id));
      jobs_list.addEventListener("render", e => Render_Job_Item(e, ctx, prospective_job, best_jobs));
      jobs_list.value = best_jobs;

      const job_elems = jobs_list.querySelectorAll("[slot=item]");
      job_elems[0].style.padding = "0";
    }

    education_list.addEventListener("render", Render_Education_Item);
    education_list.value = await ctx.db.Get_All("education");
  }
}

// events =========================================================================

// business logic =================================================================

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

async function Render_Job_Item(event, ctx, target_job, all_jobs)
{
  ctx.item_count = ctx.item_count === undefined ? 1 : ctx.item_count + 1;

  const item_elem = event.detail.item_elem;
  const job = item_elem.item_obj;
  const next_job = Get_Next_Job(job, all_jobs);

  const start_date = job.start_date;
  const end_date = next_job ? next_job.start_date : job.end_date;
  const duration_str = Duration_Str(start_date, end_date);
  const start_date_str = Render_Date(start_date);
  item_elem.dates.innerText = start_date_str + " (" + duration_str + ")";

  info_elem.Info("Generating " + job.company_name + " job title...");
  const role_title = await ctx.ai.Generate_Job_Title(job, target_job);
  item_elem.job_title.value = 
  {
    text: role_title?.suggested_title || job.role_titles, 
    original_text: job.role_titles
  };

  info_elem.Info("Generating " + job.company_name + " job description...");
  const tailored_job = await ctx.ai.Generate_Job_Description(job, target_job);
  item_elem.job_description.innerText = tailored_job.summary;
  const html = Render_List(tailored_job.bullet_points);
  if (html)
    item_elem.job_points.innerHTML = html;
  else
    item_elem.job_points.style.display = "none";

  item_elem.job_company.innerText = job.company_name;
  item_elem.job_tech.innerText = job.tech;

  ctx.item_count--;
  if (ctx.item_count < 1) info_elem.Info();
}

function Render_Education_Item(event)
{
  const item_elem = event.detail.item_elem;
  const education = item_elem.item_obj;

  item_elem.edu_title.innerText = education.title;
  item_elem.edu_institution.innerText = education.institution;
}

// rendering ======================================================================

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
