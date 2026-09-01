/**
 * Profile entity stored in the 'profiles' IndexedDB table.
 * @typedef {Object} UserProfile
 * @property {number|string} [id] Unique identifier for the profile.
 * @property {string|null} [name] Full name of the user.
 * @property {string|null} [email] Contact email address.
 * @property {string|null} [phone] Contact phone number.
 * @property {string|null} [address] Street/postal address.
 * @property {string|null} [url] Personal website or portfolio URL.
 * @property {string|null} [residency_status] Work/residency authorization status (e.g., Permanent Resident).
 * @property {string|null} [seek_url] URL to Seek profile.
 * @property {string|null} [linkedin_url] URL to LinkedIn profile.
 * @property {string|string[]|null} [personal_summary] Personal biography or attributes summary.
 * @property {string|string[]|null} [skills] Technical and professional skills.
 * @property {string|string[]|null} [interests] Personal interests and hobbies.
 */

/**
 * Education or certification record stored in the 'education' IndexedDB table.
 * @typedef {Object} EducationRecord
 * @property {number|string} [id] Unique identifier for the education entry.
 * @property {string|null} title Name of qualification, degree, or certificate.
 * @property {string|null} institution Educational institution or issuing organisation.
 * @property {number|string|null} [year] Year of completion or graduation.
 */

/**
 * Career role or work experience record stored in the 'career' IndexedDB table.
 * @typedef {Object} CareerJobRecord
 * @property {number|string} [id] Unique identifier for the career role.
 * @property {string|null} role_titles Job role title or designations.
 * @property {string|null} [company_name] Name of the employer or company.
 * @property {string|null} [company] Alternative company name property.
 * @property {'full-time'|'part-time'|'contract'|'temp'|'casual'|'internship'|'volunteer'|'vacation'|'other'|string|null} [work_type] Type of employment arrangement.
 * @property {string|null} [location] Geographical location (city, state, country, or remote).
 * @property {string|null} [summary] Role summary or overview description.
 * @property {string|null} [company_description] Description of the company/employer.
 * @property {string|null} [tech] Technologies, software, tools, and methodologies utilized.
 * @property {string|null} [responsibilities] Duties, responsibilities, and accomplishments.
 * @property {string|null} [projects] Projects worked on, deliverables, and outcomes.
 * @property {number|string|null} [start_date] Starting date (timestamp in ms or ISO YYYY-MM-DD string).
 * @property {number|string|null} [end_date] Ending date (timestamp in ms or ISO YYYY-MM-DD string), or null if current.
 */

/**
 * Combined profile dossier structure containing user profile, education, and career history.
 * @typedef {Object} FullProfile
 * @property {number|string} [id] Profile identifier.
 * @property {string} [name] User name.
 * @property {string} [email] Contact email.
 * @property {string} [phone] Contact phone.
 * @property {string} [address] Address.
 * @property {string} [url] Website URL.
 * @property {string} [residency_status] Residency status.
 * @property {string} [seek_url] Seek profile URL.
 * @property {string} [linkedin_url] LinkedIn profile URL.
 * @property {string} [personal_summary] Personal attributes/summary.
 * @property {string} [skills] Skills.
 * @property {string} [interests] Interests.
 * @property {Array<CareerJobRecord>} [work_history] Career employment history.
 * @property {Array<CareerJobRecord>} [job_history] Alias for work_history.
 * @property {Array<EducationRecord>} [education] Education and certifications.
 */

/**
 * Data access and management service for Profile, Education, and Career tables in IndexedDB.
 */
class Profile
{
  /** @type {string} Table name for user profiles in IndexedDB ('profiles') */
  static table_name = "profiles";
  /** @type {string} Table name for education records in IndexedDB ('education') */
  static edu_table_name = "education";
  /** @type {string} Table name for career/work history in IndexedDB ('career') */
  static job_table_name = "career";

  //Insert
  //Update

  /**
   * Saves or updates a user profile record in the 'profiles' table.
   * @param {Context} ctx - Application context containing db2.
   * @param {UserProfile|Object} form_data - Profile form data to save.
   * @returns {Promise<boolean|number|string>} Result of the database save operation.
   */
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

  /**
   * Saves or updates an education/certificate record in the 'education' table.
   * @param {Context} ctx - Application context containing db2.
   * @param {EducationRecord|Object} form_data - Education form data.
   * @returns {Promise<boolean|number|string>} Result of the database save operation.
   */
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

  /**
   * Saves or updates a career/job history record in the 'career' table.
   * @param {Context} ctx - Application context containing db2.
   * @param {CareerJobRecord|Object} form_data - Career job form data.
   * @returns {Promise<boolean|number|string>} Result of the database save operation.
   */
  static Job_Save(ctx, form_data)
  {
    const obj =
    {
      id: form_data.id,
      company_name: form_data.company_name?.trim() || null,
      role_titles: form_data.role_titles?.trim() || null,
      work_type: form_data.work_type?.trim() || null,
      location: form_data.location?.trim() || null,
      summary: form_data.summary?.trim() || null,
      company_description: form_data.company_description?.trim() || null,
      tech: form_data.tech?.trim() || null,
      responsibilities: form_data.responsibilities?.trim() || null,
      projects: form_data.projects?.trim() || null,
      start_date: form_data.start_date || null,
      end_date: form_data.end_date || null
    };

    return ctx.db2.Save(Profile.job_table_name, obj);
  }

  /**
   * Deletes a profile record by ID from the 'profiles' table.
   * @param {Context} ctx - Application context containing db2.
   * @param {number|string} id - The ID of the profile record to delete.
   * @returns {Promise<boolean>} Whether the record was deleted.
   */
  static Delete(ctx, id)
  {
    return ctx.db2.Delete(Profile.table_name, [id]);
  }

  /**
   * Deletes an education record by ID from the 'education' table.
   * @param {Context} ctx - Application context containing db2.
   * @param {number|string} id - The ID of the education record to delete.
   * @returns {Promise<boolean>} Whether the record was deleted.
   */
  static Edu_Delete(ctx, id)
  {
    return ctx.db2.Delete(Profile.edu_table_name, [id]);
  }

  /**
   * Deletes a career job record by ID from the 'career' table.
   * @param {Context} ctx - Application context containing db2.
   * @param {number|string} id - The ID of the career record to delete.
   * @returns {Promise<boolean>} Whether the record was deleted.
   */
  static Job_Delete(ctx, id)
  {
    return ctx.db2.Delete(Profile.job_table_name, [id]);
  }

  /**
   * Selects the first profile record from the 'profiles' table.
   * @param {Context} ctx - Application context containing db2.
   * @returns {Promise<UserProfile|null>} The first user profile or null if none exists.
   */
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

  /**
   * Selects all education records from the 'education' table, sorted by year ascending.
   * @param {Context} ctx - Application context containing db2.
   * @returns {Promise<EducationRecord[]|null>} Sorted array of education records.
   */
  static async Edu_Select(ctx)
  {
    const certificates = await ctx.db2.Select(Profile.edu_table_name);
    if (certificates)
    {
      certificates.sort((a, b) => (Number(a.year) || 0) - (Number(b.year) || 0));
    }
    return certificates;
  }

  /**
   * Selects the first non-empty profile record from the 'profiles' table.
   * @param {Context} ctx - Application context containing db2 and Utils.
   * @returns {Promise<UserProfile|null>} The user profile object or null.
   */
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

  /**
   * Selects career job records matching an optional filter, sorted descending by start_date.
   * @param {Context} ctx - Application context containing db2.
   * @param {((job: CareerJobRecord) => boolean)} [where_fn] - Optional filter predicate function.
   * @returns {Promise<CareerJobRecord[]|null>} Array of career jobs sorted by start_date descending.
   */
  static async Job_Select(ctx, where_fn)
  {
    const jobs = await ctx.db2.Select(Profile.job_table_name, where_fn);
    if (jobs)
    {
      jobs.sort((a, b) => -(a.start_date - b.start_date));
    }
    return jobs;
  }

  /**
   * Selects legacy career roles older than a set of excluded jobs up to 20 years ago.
   * @param {Context} ctx - Application context containing Utils and db2.
   * @param {Array<number|string>} exclude_ids - IDs of current/featured jobs to exclude.
   * @returns {Promise<CareerJobRecord[]>} Array of legacy career records.
   */
  static async Job_Select_Legacy(ctx, exclude_ids)
  {
    const exclude_jobs = 
      await Profile.Job_Select(ctx, j => exclude_ids.includes(j.id));
    const last_job = exclude_jobs[exclude_jobs.length - 1];
    const older_jobs =
      await Profile.Job_Select(ctx, j => j.start_date < last_job.start_date);

    const now = Date.now();
    const twenty_yrs_ago = now - (ctx.Utils.MILLIS_YEAR * 20);
    const legacy_jobs = older_jobs.filter(j => j.start_date >= twenty_yrs_ago);

    return legacy_jobs;
  }

  /**
   * Selects recent career job records from the past 20 years.
   * @param {Context} ctx - Application context containing Utils and db2.
   * @returns {Promise<CareerJobRecord[]>} Array of recent career job records.
   */
  static async Job_Select_Recent(ctx)
  {
    const jobs = await Profile.Job_Select(ctx);
    const now = Date.now();
    const twenty_yrs_ago = now - (ctx.Utils.MILLIS_YEAR * 20);
    const recent_jobs = jobs.filter(j => j.start_date >= twenty_yrs_ago);

    return recent_jobs;
  }

  /**
   * Selects a profile record by its ID from the 'profiles' table.
   * @param {Context} ctx - Application context containing db2.
   * @param {number|string} id - Profile record ID.
   * @returns {Promise<UserProfile|null>} The profile record or null.
   */
  static Select_By_Id(ctx, id)
  {
    return ctx.db2.Select_By_Id(Profile.table_name, id);
  }

  /**
   * Selects an education record by ID from the 'education' table.
   * @param {Context} ctx - Application context containing db2.
   * @param {number|string} id - Education record ID.
   * @returns {Promise<EducationRecord|null>} The education record or null.
   */
  static Edu_Select_By_Id(ctx, id)
  {
    return ctx.db2.Select_By_Id(Profile.edu_table_name, id);
  }

  /**
   * Selects a career job record by ID from the 'career' table.
   * @param {Context} ctx - Application context containing db2.
   * @param {number|string} id - Career job ID.
   * @returns {Promise<CareerJobRecord|null>} The career record or null.
   */
  static Job_Select_By_Id(ctx, id)
  {
    return ctx.db2.Select_By_Id(Profile.job_table_name, id);
  }

  /**
   * Generates HTML option elements for profile selection.
   * @param {Context} ctx - Application context.
   * @returns {Promise<string|null>} HTML string of <option> tags.
   */
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