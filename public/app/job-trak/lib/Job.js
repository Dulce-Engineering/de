class Job
{
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

  static async Select_All_Extended_Sorted(db)
  {
    const jobs = await db.Get_All("jobs");
    const agencies = await db.Get_All("agencies");
    const contacts = await db.Get_All("contacts");
    const actionLogs = await db.Get_All("action_logs");
    const attachments = await db.Get_All("attachments");

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
    const jobs = await db.Get_All("jobs");
    for (const job of jobs)
    {
      const last_action = await Job.Get_Last_Update(db, job.id);
      job.last_update = last_action ? last_action.timestamp : 0;
      await db.Update("jobs", job);
    }
  }
}

export default Job;