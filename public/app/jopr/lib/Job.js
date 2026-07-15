class Job
{
  static table_name = "jobs";
  static job_status =
  [
    { id: "bookmarked", label: "Bookmarked", type: -8 },
    { id: "accepted", label: "Accepted", type: -7 },
    { id: "offered", label: "Offered", type: -6 },
    { id: "negotiating", label: "Negotiating", type: -5 },

    { id: "interviewing", label: "Interviewing", type: -4 },
    { id: "screening", label: "Screening", type: -3 },
    { id: "applied", label: "Applied", type: -2 },
    { id: "applying", label: "Applying", type: -1 },

    { id: "rejected", label: "Rejected", type: 1 },
    { id: "withdrawn", label: "Withdrawn", type: 1 },
    { id: "ghosted", label: "Ghosted", type: 1 },
    { id: "dismissed", label: "Not interested", type: 1 },
    { id: "expired", label: "Expired", type: 1 },
    { id: "cancelled", label: "Cancelled", type: 1 },
  ];

  static To_Job(form_data)
  {
    const job =
    {
      link: form_data.link?.trim() || null,
      company: form_data.company?.trim() || null,
      duration: form_data.duration?.trim() || null,
      source: form_data.source?.trim() || null,
      description: form_data.description?.trim() || null,
      id: form_data.id,
      role_title: form_data.role_title?.trim() || null,
      role_type: form_data.role_type?.trim() || null,
      location: form_data.location?.trim() || null,
      remuneration: parseFloat(form_data.remuneration) || null,
      remuneration_unit: form_data.remuneration_unit?.trim() || null,
      agency_id: parseInt(form_data.agency_id) || null,
      contact_ids: form_data.contact_ids || null,
      status: form_data.status || "bookmarked",
      cv: form_data.cv || null,
      cl: form_data.cl?.trim() || null,
      last_update: form_data.last_update || Date.now(),
    };
    return job;
  }

  static async Select_By_Id(ctx, id)
  {
    return await ctx.db.Select_By_Id(Job.table_name, id);
  }

  static Select(ctx)
  {
    return ctx.db.Get_All(Job.table_name);
  }

  static Attachment_Select_By_Job_Id(ctx, job_id)
  {
    return ctx.db.Select("attachments", a => a.job_id === job_id);
  }

  /**
   * @param {Context} ctx
   */
  static async Select_All_Extended_Sorted(ctx)
  {
    const jobs = await Job.Select(ctx);

    let enriched_jobs = null;
    if (!ctx.Utils.Is_Empty(jobs))
    {
      enriched_jobs = [];
      for (const job of jobs)
      {
        const enriched_job = await Job.Add_Details(ctx, job);
        enriched_jobs.push(enriched_job);
      }
      enriched_jobs.sort(Job.By_Status_Update);
    }

    return enriched_jobs;
  }

  static async Add_Details(ctx, job)
  {
    const latest = await Job.Get_Last_Note(ctx, job);
    const status_type = Job.job_status.find(s => s.id === job.status)?.type;
    const agency = await ctx.Agency.Select_By_Id(ctx, job.agency_id);
    const contacts = await ctx.Contact.Select
      (ctx, c => job.contact_ids && job.contact_ids.includes(c.id));
    const attachments = await Job.Attachment_Select_By_Job_Id(ctx, job.id);
    const last_update = await Job.Calc_Update_Time(ctx, job);
    return {
      ...job,
      status_type,
      agency_name: agency?.name,
      latest_note: latest?.note,
      latest_note_time_formatted: latest?.time_str,
      attachments,
      contacts,
      last_update
    };
  }

  static async Calc_Update_Time(ctx, job)
  {
    let res = 0;

    if (job.last_update != null && job.last_update != undefined)
    {
      res = job.last_update;
    }
    else
    {
      const last_log = await Job.Get_Last_Update(ctx.db, job.id);
      if (last_log)
      {
        res = last_log.timestamp;
      }
    }

    return res;
  }

  static By_Status_Update(a, b)
  {
    let res = 0;

    if (a.status_type !== b.status_type)
    {
      res = a.status_type - b.status_type
    }
    else
    {
      //res = b.id - a.id
      res = b.last_update - a.last_update
    }

    return res;
  }

  static async Get_Last_Note(ctx, job)
  {
    let res = null;

    const latest_log = await Job.Get_Last_Update(ctx.db, job.id);
    if (latest_log)
    {
      const note = latest_log.note;
      const time_str = new Date(latest_log.timestamp).toLocaleString();
      res = {note, time_str};
    }
    else if (job.last_update)
    {
      const note = "Last activity.";
      const time_str = new Date(job.last_update).toLocaleString();
      res = {note, time_str};
    }

    return res;
  }

  static async Get_Last_Update(db, job_id)
  {
    const action_logs = await db.Get_All("action_logs");
    const job_logs = action_logs
      .filter(l => l.job_id === job_id)
      .sort((a, b) => b.timestamp - a.timestamp || b.id - a.id);
    const last_log = job_logs?.length > 0 ? job_logs[0]: null;

    return last_log;
  }

  static async Set_Update_Dates(db)
  {
    const jobs = await db.Get_All(Job.table_name);
    for (const job of jobs)
    {
      const last_action = await Job.Get_Last_Update(db, job.id);
      job.last_update = last_action ? last_action.timestamp : 0;
      await db.Update(Job.table_name, job);
    }
  }

  /**
   * @param {Context} ctx
   */
  static async Save(ctx, form_data)
  {
    let id = null;

    if (form_data)
    {
      if (form_data.agency_id == "new")
      {
        const new_agency = { name: form_data.agency_name?.trim() || "New Agency" };
        const new_agency_id = await ctx.db.Insert("agencies", new_agency);
        form_data.agency_id = new_agency_id;
      }

      if (form_data.contact_id == "new")
      {
        const new_contact =
        {
          name: form_data.contact_name?.trim(),
          phone: form_data.contact_phone?.trim(),
          agency_id: parseInt(form_data.agency_id) || null,
          email: form_data.contact_email?.trim(),
        };
        const new_contact_id = await ctx.db.Insert("contacts", new_contact);
        form_data.contact_id = new_contact_id;
      }

      if (!ctx.Utils.Is_Empty(form_data.contacts))
      {
        const contact_ids = [];
        for (const contact of form_data.contacts)
        {
          if (contact.id)
          {
            contact_ids.push(contact.id);
          }
          else
          {
            const new_contact = await ctx.Contact.Save(ctx, contact);
            contact_ids.push(new_contact.id);
          }
        }
        form_data.contact_ids = contact_ids;
      }

      const job = Job.To_Job(form_data);
      id = await ctx.db.Save(Job.table_name, job);
    }

    return id;
  }

  static Delete(ctx, job_id)
  {
    return ctx.db.Delete(Job.table_name, [job_id]);
  }

  static async AI_Import(ctx, raw_text, notify_fn)
  {
    let res = null;

    if (raw_text && ctx.ai)
    {
      if (notify_fn) await notify_fn("Extracting job data...");
      await ctx.Utils.sleep(1000);

      const data = await ctx.ai.Extract_Job(raw_text, notify_fn);
      const job = data?.job;
      const agency_id = await ctx.Agency.Insert_If_New(ctx, data?.agency);
      const contact_id = await ctx.Contact.Insert_If_New(ctx, data?.contact, agency_id);

      if (job && job.role_title)
      {
        job.agency_id = agency_id;
        job.contact_id = contact_id;
        job.status = job.status || "bookmarked";
        job.last_update = Date.now();
        res = await ctx.db2.Insert_If_New(Job.table_name, job, Fail_If);
        function Fail_If(j)
        {
          return (agency_id &&
            j.agency_id == agency_id &&
            j.role_title == job.role_title);
        }
      }

      if (notify_fn) await notify_fn();
    }
    return res;
  }
}

export default Job;