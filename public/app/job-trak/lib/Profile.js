class Profile
{
  static table_name = "profiles";
  static edu_table_name = "education";
  static job_table_name = "career";

  //Insert
  //Update

  static Save(ctx, form_data)
  {
    /*const obj =
    {
      id: form_data.id,
      name: form_data.name?.trim() || null,
      url: form_data.url?.trim() || null,
    };*/

    return ctx.db2.Save(Profile.table_name, form_data);
  }

  static Edu_Save(ctx, form_data)
  {
    const obj =
    {
      id: form_data.id,
      title: form_data.title?.trim() || null,
      institution: form_data.institution?.trim() || null,
      year: form_data.year || null,
    };

    return ctx.db2.Save(Profile.edu_table_name, obj);
  }

  static Job_Save(ctx, form_data)
  {
    const obj =
    {
      id: form_data.id,
      company_name: form_data.company_name?.trim() || null,
      role_titles: form_data.role_titles?.trim() || null,
      work_type: form_data.work_type?.trim() || null,
      location: form_data.location?.trim() || null,
      tech: form_data.tech?.trim() || null,
      responsibilities: form_data.responsibilities?.trim() || null,
      projects: form_data.projects?.trim() || null,
      start_date: form_data.start_date || null,
      end_date: form_data.end_date || null
    };

    return ctx.db2.Save(Profile.job_table_name, obj);
  }

  static Delete(ctx, id)
  {
    return ctx.db2.Delete(Profile.table_name, [id]);
  }

  static Edu_Delete(ctx, id)
  {
    return ctx.db2.Delete(Profile.edu_table_name, [id]);
  }

  static Job_Delete(ctx, id)
  {
    return ctx.db2.Delete(Profile.job_table_name, [id]);
  }

  static async Select_First(ctx)
  {
    let profile = null;
    const profiles = await ctx.db2.Select(Profile.table_name);
    if (profiles)
    {
      profile = profiles[0];
    }
    return profile;
  }

  static async Edu_Select(ctx)
  {
    const certificates = await ctx.db2.Select(Profile.edu_table_name);
    if (certificates)
    {
      certificates.sort((a, b) => a.year - b.year);
    }
    return certificates;
  }

  static async Select(ctx)
  {
    let profile = null;
    const profiles = await ctx.db2.Select(Profile.table_name);
    if (profiles)
    {
      profile = !ctx.Utils.Is_Empty(profiles) ? profiles[0] : null;
    }
    return profile;
  }

  static async Job_Select(ctx, where_fn)
  {
    const jobs = await ctx.db2.Select(Profile.job_table_name, where_fn);
    if (jobs)
    {
      jobs.sort((a, b) => -(a.start_date - b.start_date));
    }
    return jobs;
  }

  static async Job_Select_Legacy(ctx, exclude_ids)
  {
    const exclude_jobs = 
      await Profile.Job_Select(ctx, j => exclude_ids.includes(j.id));
    const last_job = exclude_jobs[exclude_jobs.length - 1];
    // last_job.start_date

    const legacy_jobs =
      await Profile.Job_Select(ctx, j => j.start_date < last_job.start_date);

    return legacy_jobs;
  }

  static Select_By_Id(ctx, id)
  {
    return ctx.db2.Select_By_Id(Profile.table_name, id);
  }

  static Edu_Select(ctx)
  {
    const edu = ctx.db2.Select(Profile.edu_table_name);

    return edu;
  }

  static Edu_Select_By_Id(ctx, id)
  {
    return ctx.db2.Select_By_Id(Profile.edu_table_name, id);
  }

  static Job_Select_By_Id(ctx, id)
  {
    return ctx.db2.Select_By_Id(Profile.job_table_name, id);
  }

  static async Get_Options(ctx)
  {
    let html = null;
    const objs = await Profile.Select(ctx);
    if (objs)
    {
      html =
        "<option>None</option>" +
        "<option value='new'>New thing</option>";
      for (const obj of objs)
      {
        html += "<option value='" + obj.id + "'>" + obj.name + "</option>";
      }
    }

    return html;
  }
}

export default Profile;