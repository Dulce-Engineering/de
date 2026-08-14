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
    { id: "applying", label: "Applying", type: -2 },
    { id: "applied", label: "Applied", type: -1 },

    { id: "rejected", label: "Rejected", type: 1 },
    { id: "withdrawn", label: "Withdrawn", type: 1 },
    { id: "ghosted", label: "Ghosted", type: 1 },
    { id: "dismissed", label: "Not interested", type: 1 },
    { id: "expired", label: "Expired", type: 1 },
    { id: "cancelled", label: "Cancelled", type: 1 },
  ];
  static work_types =
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

  static Count(ctx)
  {
    return ctx.db.Count(Job.table_name);
  }

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

  static Select(ctx, where_fn, order_by_fn, pre_fn)
  {
    return ctx.db.Select(Job.table_name, where_fn, order_by_fn, pre_fn);
  }

  static Attachment_Select_By_Job_Id(ctx, job_id)
  {
    return ctx.db.Select("attachments", a => a.job_id === job_id);
  }

  static async Attachment_Add_By_Job_Id(ctx, job_id, files)
  {
    const attachments = files.map(file => ({
      job_id,
      file,
      timestamp: Date.now()
    }));
    const res = await ctx.db.Insert_Items('attachments', attachments);
    if (res)
    {
      await Job.Update_Time(ctx, job_id);
    }

    return res;
  }

  static async Action_Add_By_Job_Id(ctx, job_id, note, status)
  {
    let res = null;

    if (job_id && (!ctx.Utils.Is_Empty(note) || !ctx.Utils.Is_Empty(status)))
    {
      if (!ctx.Utils.Is_Empty(note))
      {
        const now = new Date();
        const action =
        {
          job_id,
          time_str: now.toISOString().split('T')[0],
          timestamp: now.getTime(),
          note
        };
        await ctx.db.Insert("action_logs", action);
      }

      if (!ctx.Utils.Is_Empty(status))
      {
        const job = { id: job_id, status };
        await ctx.db.Update(Job.table_name, job);
      }

      res = await Job.Update_Time(ctx, job_id);
    }

    return res;
  }

  static async Update_Time(ctx, job_id)
  {
    const job = { id: job_id, last_update: Date.now() };
    const res = await ctx.db.Update(Job.table_name, job);

    return res;
  }

  /**
   * @param {Context} ctx
   */
  static async Select_All_Extended_Sorted(ctx, filters)
  {
    const jobs = await Job.Select
    (
      ctx, 
      j => Job.Apply_Filters(j, filters), 
      Job.Order_By_Status_Update, 
      j => Job.Add_Details(ctx, j)
    );

    return jobs;
  }

  static Apply_Filters(job, filters)
  {
    let res = true;

    if (filters)
    {
      if (filters.is_active === true)
      {
        res = !Job.Is_Old(job) && !Job.Is_Failed(job);
      }
      else if (filters.is_active === false)
      {
        res = Job.Is_Old(job) || Job.Is_Failed(job);
      }

      if (res && filters.match_str)
      {
        const search_term = filters.match_str.toLowerCase();
        res = Job.Has_Str_Match(job, search_term);
      }
    }

    return res;
  }

  static Has_Str_Match(val, search_term)
  {
    let res = false;

    if (val !== null && val !== undefined) 
    {
      if (typeof val === 'object') 
      {
        res = Object.values(val).some(v => Job.Has_Str_Match(v, search_term));
      }
      else
      {
        res = String(val).toLowerCase().includes(search_term);
      }
    }

    return res;
  };

  /**
   * Recursively searches through all fields of objects in an array.
   * @param {Array<Object>} list - Array of objects to search.
   * @param {string} target - Query string to match against.
   * @returns {Array<Object>} Filtered array containing matching objects.
   */
  searchObjects(list, target) 
  {
    if (!target || typeof target !== 'string') return list;

    const searchTerm = target.toLowerCase();

    // Helper function to check if a value contains the target string

    return list.filter((item) => checkValue(item, searchTerm));
  }

  static Is_Old(job)
  {
    const now = Date.now();
    const elapsed_time = now - job.last_update;
    const two_weeks = 1209600000;
    return elapsed_time > two_weeks;
  }

  static Get_Status_Type(job)
  {
    const status_type = Job.job_status.find(s => s.id === job.status)?.type;
    return status_type;
  }

  static Is_Failed(job)
  {
    return Job.Get_Status_Type(job) > 0;
  }

  static async Add_Details(ctx, job)
  {
    const latest = await Job.Get_Last_Note(ctx, job);
    const agency = await ctx.Agency.Select_By_Id(ctx, job.agency_id);
    const contacts = await ctx.Contact.Select
      (ctx, c => job.contact_ids && job.contact_ids.includes(c.id));
    const attachments = await Job.Attachment_Select_By_Job_Id(ctx, job.id);
    return {
      ...job,
      agency_name: agency?.name,
      latest_note: latest?.note,
      latest_note_time_formatted: latest?.time_str,
      attachments,
      contacts,
      contact: !ctx.Utils.Is_Empty(contacts) ? contacts[0] : null,
    };
  }

  static Order_By_Status_Update(a, b)
  {
    let res = 0;

    const a_status_type = Job.Get_Status_Type(a);
    const b_status_type = Job.Get_Status_Type(b);
    if (a_status_type !== b_status_type)
    {
      res = a_status_type - b_status_type
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
            const new_contact_id = await ctx.Contact.Save(ctx, contact);
            contact_ids.push(new_contact_id);
          }
        }
        form_data.contact_ids = contact_ids;
      }

      const job = Job.To_Job(form_data);
      job.last_update = Date.now();
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