class Profile
{
  static table_name = "template";
  static edu_table_name = "education";
  static job_table_name = "career";

  //Insert
  //Update

  static Save(ctx, form_data)
  {
    const obj =
    {
      id: form_data.id,
      name: form_data.name?.trim() || null,
      url: form_data.url?.trim() || null,
    };

    return ctx.db2.Save(Profile.table_name, obj);
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

  static async Select(ctx)
  {
    const agencies = await ctx.db2.Select(Profile.table_name);
    if (agencies)
    {
      agencies.sort((a, b) => a.name.localeCompare(b.name));
    }
    return agencies;
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

  static Select_By_Id(ctx, id)
  {
    return ctx.db2.Select_By_Id(Profile.table_name, id);
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