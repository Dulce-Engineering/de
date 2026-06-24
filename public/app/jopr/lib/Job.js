class Job
{
  static table_name = "jobs";
  static job_status =
  [
    { id: "bookmarked", label: "Bookmarked", type: 0 },
    { id: "applying", label: "Applying", type: 0 },
    { id: "applied", label: "Applied", type: 0 },
    { id: "screening", label: "Screening", type: 0 },
    { id: "interviewing", label: "Interviewing", type: 0 },
    { id: "negotiating", label: "Negotiating", type: 0 },
    { id: "offered", label: "Offered", type: 0 },
    { id: "accepted", label: "Accepted", type: 0 },
    { id: "rejected", label: "Rejected", type: 1 },
    { id: "withdrawn", label: "Withdrawn", type: 1 },
    { id: "ghosted", label: "Ghosted", type: 1 },
    { id: "dismissed", label: "Not interested", type: 1 },
    { id: "expired", label: "Expired", type: 1 },
  ];

  static async Select_By_Id(db, id)
  {
    return await db.Select_By_Id(Job.table_name, id);
  }

  static async Select_All_Extended_Sorted(ctx)
  {
    const jobs = await ctx.db2.Get_All(Job.table_name);
    const agencies = await ctx.db2.Get_All("agencies");
    const contacts = await ctx.db2.Get_All("contacts");
    const actionLogs = await ctx.db2.Get_All("action_logs");
    const attachments = await ctx.db2.Get_All("attachments");

    const enrichedJobs = jobs.map(Add_Details);
    function Add_Details(job) 
    {
      const status_type = Job.job_status.find(s => s.id === job.status)?.type;
      const latestLog = actionLogs
        .filter(log => log.job_id === job.id)
        .sort((a, b) => b.timestamp - a.timestamp || b.id - a.id)[0];
      const agency_name = agencies?.find(a => a.id === job.agency_id)?.name;
      const contact_name = contacts?.find(c => c.id === job.contact_id)?.name;
      const latest_note = latestLog?.note;
      const latest_note_time_formatted = latestLog ? new Date(latestLog.timestamp).toLocaleString() : "";
      const job_attachments = attachments.filter(a => a.job_id === job.id);

      return {
        ...job,
        status_type,
        agency_name,
        contact_name,
        latest_note,
        latest_note_time_formatted,
        attachments: job_attachments
      };
    }

    enrichedJobs.sort(By_Status_Update);
    function By_Status_Update(a, b)
    {
      return a.status_type !== b.status_type ?
        a.status_type - b.status_type :
        b.last_update - a.last_update;
    }

    return enrichedJobs;
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

  static async Save(db, form_data)
  {
    let res = null;

    if (form_data)
    {
      if (form_data.agency_id == "new")
      {
        const new_agency = { name: form_data.agency_name?.trim() || "New Agency" };
        const new_agency_id = await db.Insert("agencies", new_agency);
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
        const new_contact_id = await db.Insert("contacts", new_contact);
        form_data.contact_id = new_contact_id;
      }

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
        contact_id: parseInt(form_data.contact_id) || null,
        status: form_data.status || null
      };

      res = await db.Save(Job.table_name, job);
    }

    return res;
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