import Utils from "../../../lib/Utils.js";

/**
 * Service class for interacting with Firebase AI (Gemini).
 */
class AI
{
  /**
   * Firebase AI module reference.
   * @type {any}
   */
  fb_ai = null;

  /**
   * Firebase App instance.
   * @type {any}
   */
  fb_app = null;

  /**
   * Vertex AI client instance.
   * @type {any}
   */
  ai = null;

  /**
   * Creates and initializes a new instance of the AI class.
   * @param {any} fb_app - The Firebase app module/SDK instance.
   * @param {any} fb_ai - The Firebase AI module/SDK instance.
   * @returns {Promise<AI | null>} A promise that resolves to the initialized AI instance, or null if initialization fails.
   */
  static async New(fb_app, fb_ai)
  {
    let res = null;
    const response = await fetch("/__/firebase/init.json");
    if (response.ok)
    {
      const fb_config = await response.json();
      //console.info("AI.New(): fb_config =", fb_config);
      const app = fb_app.initializeApp(fb_config);

      res = new AI();
      res.fb_ai = fb_ai;
      res.fb_app = app;
      res.ai = fb_ai.getAI(app, { backend: new fb_ai.GoogleAIBackend() });
    }

    return res;
  }

  /**
   * Extracts contact, agency, and job details from raw text (e.g. email or job ad).
   * @param {string} text - The raw text of the job description or email to analyze.
   * @param {function(string): (void | Promise<void>)} [notify_fn] - Optional callback to receive progress updates.
   * @returns {Promise<ExtractedJobResult>} A promise that resolves to the structured extracted data.
   */
  async Extract_Job(text, notify_fn)
  {
    const contact_schema =
    {
      type: this.fb_ai.SchemaType.OBJECT,
      properties:
      {
        email:
        {
          type: "string",
          description: "The sender's or contact's email address."
        },
        name:
        {
          type: "string",
          description: "The sender's or contact's fullname as a single string."
        },
        phone:
        {
          type: "string",
          description: "The sender's or contact's phone number."
        },
        position:
        {
          type: "string",
          description: "The sender's or contact's role or position within the agency or company."
        },
      },
    };
    let prompt =
    `
      Analyze the following text about a job opportunity and extract any contact details. 
      This text may be sourced from an email or a job advertisement so if a contact is available it will
      usually be the sender of the email or the contact person for the job ad.
      Job details follow:
      ${text}
    `;
    if (notify_fn) await notify_fn("Extracting contact details...");
    const contact = await this.Prompt(prompt, contact_schema);

    const agency_schema =
    {
      type: this.fb_ai.SchemaType.OBJECT,
      properties:
      {
        address:
        {
          type: "string",
          description: "The agency's physical address."
        },
        email:
        {
          type: "string",
          description: "The agency's corporate email address."
        },
        industry:
        {
          type: "string",
          description: "The industry or sector the job agency operates in."
        },
        name:
        {
          type: "string",
          description: "The agency's official name."
        },
        phone:
        {
          type: "string",
          description: "The agency's contact phone number."
        },
        url:
        {
          type: "string",
          description: "The agency's website URL."
        },
      },
    };
    prompt =
    `
      Analyze the following text about a job opportunity and extract any job agency details. 
      This text may have corporate details of the agency that posted the job or 
      details of the client company that the agency is recruiting for. Only extract
      details of the agency if it is clear that it is an agency that is posting the 
      job ad on behalf of a client company.
      Job details follow:
      ${text}
    `;
    if (notify_fn) await notify_fn("Extracting agency details...");
    const agency = await this.Prompt(prompt, agency_schema);

    const job_schema =
    {
      type: this.fb_ai.SchemaType.OBJECT,
      properties:
      {
        company:
        {
          type: "string",
          description: "The name of the company the job is for."
        },
        duration:
        {
          type: "string",
          description: "The length of time the job is for, if it is a contract role."
        },
        location:
        {
          type: "string",
          description: "The location of the job"
        },
        remuneration:
        {
          type: "number",
          description: "The numerical amount being paid for the job not including units of any kind."
        },
        remuneration_unit:
        {
          type: "string",
          description: "The units of the amount being paid for the job. usually yearly or daily."
        },
        role_title:
        {
          type: "string",
          description: "The job role title."
        },
        role_type:
        {
          type: "string",
          enum: ["Contract", "Fulltime", "Other"],
          description: "Whether the job is a contract, fulltime, or something else."
        },
      },
      required: ["role_title"]
    };
    prompt =
      `
      Analyze the following text about a job opportunity and extract job details. 
      Extract the company name, job duration, location, 
      remuneration amount and units, role title, and role type if available.
      Job details follow:
      ${text}
    `;
    if (notify_fn) await notify_fn("Extracting job details...");
    const job = await this.Prompt(prompt, job_schema);

    const details_schema =
    {
      type: this.fb_ai.SchemaType.OBJECT,
      properties:
      {
        description:
        {
          type: "string",
          description: "Any details regarding the job's technical requirements and responsibilities."
        }
      },
    };
    prompt =
      "You are an expert data parsing assistant.Your sole task is to extract the main " +
      "body of a job description from a messy copy - and - pasted text string./n/n" +
      "### CRITICAL RULES:/n" +
      "1. PRESERVE THE CONTENT: Copy the actual job description text(responsibilities, " +
      "requirements, about the company, daily tasks) completely VERBATIM.Do not rewrite, " +
      "summarize, or paraphrase a single sentence./n" +
      "2. EXCLUDE ALL METADATA: Absolutely do not include any metadata.If you see fields " +
      "like Job Title, Location, Salary, Pay Range, Job Type(Full - time / Part - time), " +
      "Benefits list, Date Posted, or Company Name at the top or bottom, IGNORE them " +
      "completely./n" +
      "3. NO EXTRA TEXT: Do not include introductory text like " +
      "'Here is the extracted text:' or any polite sign - offs. Output ONLY the " +
      "extracted job description body text./n/n" +
      "### MESSY INPUT TEXT TO PARSE:/n" + text + "/n/n" +
      "### MAIN BODY JOB DESCRIPTION OUTPUT:";
    if (notify_fn) await notify_fn("Extracting job description...");
    const details = await this.Prompt(prompt, details_schema);
    job.description = details.description;

    return { agency, contact, job };
  }

  /**
   * Extracts detailed history for a specific career job from the CV document.
   * @param {CareerJobInput} job - The job node to detail.
   * @param {{ mime_type: string, data: string }} file - The base64 file data of the CV.
   * @returns {Promise<CareerJobDetails | null>} The extracted job details, or null.
   */
  async Extract_Career_Job(job, file)
  {
    const job_schema =
    {
      type: "object",
      properties:
      {
        start_date:
        {
          type: "string",
          nullable: true,
          description: "The starting date of the role in ISO format (YYYY-MM-DD) if available, or just the year (YYYY) if the full date cannot be determined."
        },
        end_date:
        {
          type: "string",
          nullable: true,
          description: "The ending date of the role in ISO format (YYYY-MM-DD) if available, or just the year (YYYY) if the full date cannot be determined."
        },
        work_type:
        {
          type: "string",
          nullable: true,
          description: "The type of work performed (e.g., full-time, part-time, contract).",
          enum: ["full-time", "part-time", "contract", "temp", "casual", "internship", "volunteer", "vacation", "other"],
        },
        location:
        {
          type: "string",
          nullable: true,
          description: "The location of the role. This could be a city, state, or country depending on the level of detail available in the CV."
        },
        company_description:
        {
          type: "string",
          nullable: true,
          description: "An optional description of the company at which the role took place."
        },
        tech:
        {
          type: "string",
          nullable: true,
          description: "The technologies or tools used in the role. This could include programming languages, software, methodologies, or any other relevant technical skills mentioned in the CV."
        },
        responsibilities:
        {
          type: "string",
          nullable: true,
          description: "The responsibilities and duties undertaken in the role."
        },
        projects:
        {
          type: "string",
          nullable: true,
          description: "The projects worked on in the role, accomplishments, or achievements."
        },
        summary:
        {
          type: "string",
          nullable: true,
          description: "Any additional information provided about the job or summary data that may be available."
        },
      },
    };
    const prompt =
      "From the given CV document extract the deatils of the job titled " + job.role_titles + 
      " at company " + job.company + ". Return a single job object with start_date, " +
      "end_date, work_type, location, company description, tech, responsibilities, " +
      "projects, and any role summary details.";
    const job_details = await this.Prompt(prompt, job_schema, file);
    AI.Clean_Empty_Fields(job_details);

    return job_details || null;
  }

  /**
   * Extracts education history and full career history from a CV file blob.
   * @param {Blob} cv_blob - The CV file blob (e.g. PDF).
   * @returns {Promise<ExtractedCVResult>} The extracted education and career history.
   */
  async Extract_CV(cv_blob, notify_fn = console.info)
  {
    const base64 = await Utils.Blob_To_Base64(cv_blob);

    notify_fn("Processing education...");
    const education_schema =
    {
      type: "array",
      items:
      {
        type: "object",
        properties:
        {
          title:
          {
            type: "string",
            description: "The title of the certificate or degree obtained."
          },
          institution:
          {
            type: "string",
            description: "The name of the educational institution."
          },
          year:
          {
            type: "integer",
            description: "The year the education was completed or null if it could not be determined."
          }
        },
        required: ["title", "institution"]
      }
    };
    let prompt =
      "Extract the education history from the following CV document. " +
      "Return a list of education objects, each with title, institution, and year.";
    const file = { mime_type: cv_blob.type, data: base64 };
    const educations = await this.Prompt(prompt, education_schema, file);

    notify_fn("Processing career...");
    const career_schema =
    {
      type: "array",
      items:
      {
        type: "object",
        properties:
        {
          role_titles:
          {
            type: "string",
            description: "The name or names of the position held, including any seniority levels or specializations (e.g., 'Software Engineer II', 'Data Scientist - NLP'). If multiple roles were held at the same company, list them all separated by commas."
          },
          company_name:
          {
            type: "string",
            description: "The name of the company where the role was held."
          },
        },
        required: ["role_titles", "company_name"]
      }
    };
    prompt =
      "Extract the career history from the following CV document. " +
      //"Return a list of job objects, each with role_titles, company_name, start_date, end_date, work_type, location, tech, responsibilities, and projects.";
      "Return a list of job objects, each with role_titles and company_name.";
    const career = await this.Prompt(prompt, career_schema, file);

    for (const job of career)
    {
      notify_fn("Processing job " + job.role_titles + "...");
      const job_data = await this.Extract_Career_Job(job, file);
      Object.assign(job, job_data);
    }

    return { educations, career };
  }

  /**
   * Compares the applicant's complete employment timeline against a target job and selects the most relevant roles.
   * @param {Array<Object>} career_jobs - The applicant's career history records.
   * @param {import("./Job.js").default} target_job - The target job description.
   * @returns {Promise<number[] | null>} A promise that resolves to an array of selected career job IDs, or null.
   */
  async Select_Best_Jobs(career_jobs, target_job)
  {
    let res = null;

    if (this.ai && career_jobs && target_job)
    {
      const job_summaries = career_jobs.map(j => (
        {
          id: j.id,
          role_titles: j.role_titles,
          company_name: j.company_name,
          start_date: AI.To_AI_Date(j.start_date),
          end_date: AI.To_AI_Date(j.end_date),
          work_type: j.work_type,
          tech: j.tech,
          responsibilities: j.responsibilities,
          projects: j.projects
        }));
      const Schema = this.fb_ai.Schema;
      const schema = Schema.object(
        {
          properties:
          {
            selected_job_ids: Schema.array(
              {
                items: Schema.integer(),
                description:
                  "The unique IDs of the selected career job records, sorted in " +
                  "recommended order of appearance."
              }),
            justification: Schema.string(
              {
                description:
                  "A brief professional explanation of why this specific selection " +
                  "represents the strongest strategic fit for the target role."
              })
          },
          required: ["selected_job_ids", "justification"]
        });
      const sys_instruction = `
        You are an expert technical recruiter and resume strategist. Your job is to select the 
        most impactful and chronologically relevant professional roles from an applicant's history 
        to tailor their CV for a specific target job opening.
        
        CRITICAL SELECTION MATRICES:
        1. RECENCY CRITERIA: Always prioritize the applicant's current or most recent role 
          to prevent major, unexplainable gaps at the top of the resume. Select from the ten most recent roles.
        2. RELEVANCE CRITERIA: Select remaining roles based on technical overlap, 
          architectural alignment, and scope of responsibility demanded by the job description.
        3. EFFICIENCY: Select only the most meaningful positions (typically a maximum of 5 to 6 roles) 
          that build a compelling narrative for this specific target position.
        
        Do not output conversational markdown text or text block wrappers outside the schema.
      `;
      const prompt = `
        Analyze the applicant's complete employment timeline against the new target job description. 
        Select the optimal historical roles to feature on a tailored CV.

        ### TARGET JOB DESCRIPTION:
        - Title: ${target_job.role_title}
        - Description Text:
        \`\`\`text
        ${target_job.description}
        \`\`\`

        ### COMPLETE APPLICANT EMPLOYMENT HISTORY (JSON):
        \`\`\`json
        ${JSON.stringify(job_summaries, null, 2)}
        \`\`\`

        OUTPUT REQUIREMENT:
        Return a structured JSON object matching the requested schema containing the selected IDs.
      `;

      const ai_res = await this.Prompt(prompt, schema, null, sys_instruction);
      res = ai_res?.selected_job_ids;
    }
    else if (career_jobs)
    {
      res = career_jobs.map(j => j.id);
    }

    return res;
  }

  /**
   * Generates a tailored cover letter using the applicant's profile and target job details.
   * @param {FullProfile} profile - The applicant's profile and work history.
   * @param {import("./Job.js").default} job - The target job description.
   * @returns {Promise<string | null>} The tailored cover letter text.
   */
  async Generate_Cover_Letter(profile, job)
  {
    let res = null;

    if (this.ai && job && profile)
    {
      const prompt = `
        Please generate a tailored cover letter using the following datasets.
        
        ### APPLICANT PROFILE & WORK HISTORY (JSON Data):
        \`\`\`json
        ${JSON.stringify(profile, null, 2)}
        \`\`\`
        
        ### TARGET JOB DESCRIPTION (Pasted Text):
        \`\`\`text
        ${job.description}
        \`\`\`
        
        Output only the completed text of the cover letter.
      `;
      const sys_instruction = `
        You are an expert career coach and professional copywriter. 
        Your task is to write a compelling, tailored cover letter based on a user's JSON resume and the target JSON job details.
        
        Guidelines:
        1. Highlight specific matches between the applicant's experience and the job's core requirements.
        2. Maintain a professional, confident, yet authentic tone. Avoid buzzwords like "synergy" or "rockstar".
        3. Only generate the cover letter's main body text. Do not include a header with the applicant's details or company details.
        4. Only use facts present in the provided JSON resume. Do not invent metrics or roles.
      `;
      res = await this.Prompt(prompt, null, null, sys_instruction);
    }

    return res;
  }

  /**
   * Crafts a tailored personal summary paragraph for a CV matching a target job.
   * @param {import("./Job.js").default} job - The target job description.
   * @param {FullProfile} profile - The applicant's profile.
   * @returns {Promise<string | null>} The tailored personal summary.
   */
  async Generate_Summary(job, profile)
  {
    let res = null;

    if (this.ai && job && profile)
    {
      const sys_instruction = `
        You are an expert resume writer and career coach. Your task is to craft a highly 
        tailored, impactful "Professional Summary" for a CV (approximately 3-4 sentences). 
        The summary must directly align the applicant's real work history and skills 
        with the core requirements found in the provided job description. Maintain a 
        confident, professional, and sophisticated tone. Avoid generic buzzwords.
      `;
      const prompt = `
        Please write a tailored CV Professional Summary based on the two data sources provided below.

        ### TARGET JOB DESCRIPTION (Pasted Text):
        \`\`\`text
        ${job.description}
        \`\`\`

        ### APPLICANT PROFILE & WORK HISTORY (JSON Data):
        \`\`\`json
        ${JSON.stringify(profile, null, 2)}
        \`\`\`

        ### OUTPUT INSTRUCTIONS:
        - Write a cohesive 3-4 sentence paragraph.
        - Synthesize the applicant's experience to highlight the specific metrics, languages, or architectural preferences demanded by the job description.
        - Do not invent any historical achievements or technologies not explicitly listed in the profile JSON data.
        - Output only the final paragraph text.
      `;
      res = await this.Prompt(prompt, null, null, sys_instruction);
    }
    else if (profile)
    {
      res = profile.personal_summary;
    }

    return res;
  }

  /**
   * Extracts a filtered, prioritized list of matching skills for a target job.
   * @param {import("./Job.js").default} job - The target job.
   * @param {Array<Object>} career_jobs - The historical jobs containing tech stacks.
   * @param {FullProfile} profile - The user profile containing skills.
   * @returns {Promise<string[] | null>} Array of matching skills.
   */
  async Generate_Skills(job, career_jobs, profile)
  {
    let res = null;
    const SKILL_COUNT = 15;

    if (this.ai && job && career_jobs)
    {
      const skills = career_jobs.map(j => (
        {
          role_titles: j.role_titles,
          company_name: j.company_name,
          tech: j.tech
        }));

      const Schema = this.fb_ai.Schema;
      const schema = Schema.object({
        properties:
        {
          matched_skills: Schema.array(
            {
              items: Schema.string(),
              maxItems: SKILL_COUNT,
              description:
                "The top " + SKILL_COUNT + " most critical and relevant technologies from the " +
                "applicant's history that are explicitly or " +
                "conceptually requested in the job description or might be relevant, " +
                "sorted in descending order of importance. " +
                "Unless explicitly requested EXCLUDE any legacy, deprecated, or " +
                "obsolete tools that are no longer actively maintained or standard " +
                "in modern development environments."
            })
        },
        required: ["matched_skills"]
      });
      const sys_instruction = `
            You are a precise technical data parser. Your job is to compare a list of 
            applicant skills against a raw job description and extract a filtered list 
            of matching or relevant skills. Only include skills that the applicant actually possesses 
            and that are relevant to the requirements, technologies, or architectural concepts 
            mentioned in the job description. Do not add any conversational text or markdown formatting.

            SELECTION RULES:
            1. Unless explicitly requested only include modern, actively utilized, and maintained technologies.
            2. Evaluate their importance relative to the core responsibilities outlined in the job description.
            3. Sort the matching skills in descending order of relevance (highest priority skills first).
            4. Select ONLY the top 10 most relevant matching items. If there are fewer than ${SKILL_COUNT} matches,
              return all available matches. Under no circumstances return more than ${SKILL_COUNT} items.
          `;
      const prompt = `
            Analyze the following data sources to find intersections in technical skills.

            ### TARGET JOB DESCRIPTION:
            - Title: ${job.role_title}
            - Description Text:
            \`\`\`text
            ${job.description}
            \`\`\`

            ### APPLICANT DESCRIPTIONS OF PREVIOUS JOBS:
            \`\`\`json
            ${JSON.stringify(skills, null, 2)}
            \`\`\`

            OUTPUT REQUIREMENT:
            - Filter out any outdated or legacy tech stack items unless explicitly requested.
            - Return a JSON object matching the requested schema containing only the matching skills.
            - Return up to ${SKILL_COUNT} sorted skills.
          `;
      const ai_res = await this.Prompt(prompt, schema, null, sys_instruction);
      res = ai_res?.matched_skills;
    }
    else if (profile.skills)
    {
      res = profile.skills.split(",");
    }

    return res;
  }

  /**
   * Rewrites details of a single past job experience to align with a target job description.
   * @param {Object} career_job - The historical job entry to rewrite.
   * @param {import("./Job.js").default} target_job - The target job description.
   * @returns {Promise<{ summary: string, bullet_points: string[] } | null>} The rewritten job summary and accomplishments.
   */
  async Generate_Job_Description(career_job, target_job)
  {
    let res = null;

    if (this.ai && career_job && target_job)
    {
      const job_summary =
      {
        role_titles: career_job.role_titles,
        company_name: career_job.company_name,
        tech: career_job.tech,
        responsibilities: career_job.responsibilities,
        projects: career_job.projects
      };
      const Schema = this.fb_ai.Schema;
      const schema = Schema.object(
        {
          properties:
          {
            summary: Schema.string(
              {
                description:
                  "A 2-3 sentence high-level overview of the role, framed to match " +
                  "the prospective job's tone and focus."
              }),
            bullet_points: Schema.array(
              {
                items: Schema.string(),
                description:
                  "3 to 5 high-impact, results-oriented bullet points tracking real " +
                  "accomplishments, starting with strong action verbs."
              })
          },
          required: ["summary", "bullet_points"]
        });
      const sys_instruction = `
            You are an elite resume editor specializing in technical role alignment. Your goal 
            is to rewrite the details of a single past job experience so that it speaks directly 
            to the requirements, technical stacks, and core problems outlined in a target job description.
            
            CRITICAL ALIGNMENT RULES:
            1. RE-FRAME, DO NOT FABRICATE: Elevate and emphasize existing technical choices, 
              architectures, or methodologies that overlap with the target role. Never invent 
              new skills, keywords, or metrics that do not exist in the source text.
            2. LANGUAGE TUNING: Use strong, industry-standard action verbs. Match the vocabulary 
              and tone of the prospective job description (e.g., if they ask for "performance optimization", 
              frame relevant past optimization work using those exact structural themes).
            3. BULLET ARCHITECTURE: Each bullet point should ideally tie an action to a technical context 
              and a professional outcome.
            
            Do not output conversational text or markdown code blocks outside the schema boundaries.
          `;
      const prompt = `
            Please review the target prospective job opening and rewrite the provided historical job entry 
            to optimize its alignment with the new role's requirements.

            ### TARGET PROSPECTIVE JOB DETAILS:
            - Title: ${target_job.role_title}
            - Description Text:
            \`\`\`text
            ${target_job.description}
            \`\`\`

            ### SOURCE HISTORICAL JOB TO REWRITE (JSON):
            \`\`\`json
            ${JSON.stringify(job_summary, null, 2)}
            \`\`\`

            OUTPUT REQUIREMENT:
            Return a structured JSON object adhering perfectly to the schema containing the rewritten summary and bullet points.
          `;
      res = await this.Prompt(prompt, schema, null, sys_instruction);
    }
    else if (career_job)
    {
      res =
      {
        summary: career_job.responsibilities,
        bullet_points: career_job.projects?.split(/\r?\n|\r/),
      };
    }

    return res;
  }

  /**
   * Suggests an alternate, tailored title for a historical job based on the target job requirements.
   * @param {Object} career_job - The historical job entry.
   * @param {import("./Job.js").default} target_job - The target job.
   * @returns {Promise<{ suggested_title: string, reasoning: string } | null>} The suggested title and reasoning.
   */
  async Generate_Job_Title(career_job, target_job)
  {
    let res = null;

    if (this.ai && career_job && target_job)
    {
      const job_summary =
      {
        role_titles: career_job.role_titles,
        company_name: career_job.company_name,
        tech: career_job.tech,
        responsibilities: career_job.responsibilities,
        projects: career_job.projects
      };
      const Schema = this.fb_ai.Schema;
      const schema = Schema.object(
        {
          properties:
          {
            suggested_title: Schema.string(
              {
                description: 'The contextually adjusted title for the past job node.'
              }),
            reasoning: Schema.string(
              {
                description: 'A 1-sentence explanation of why this title is an accurate structural match.'
              }),
          },
          required: ['suggested_title', 'reasoning']
        });
      const prompt = `
            You are the core Resume Optimization Engine for jopr, a privacy-focused job tracker.
            Analyze this historical job against the target job requirements to suggest a tailored alternate title.

            ### Title Tailoring Directives:
            1. **Maintain Integrity:** Never inflate a title beyond the user's historical scope (e.g., do not turn a Mid-level developer into a Principal/Lead).
            2. **The Seniority Cap:** If the target role is an Individual Contributor (e.g., "Senior React Engineer") and the past title is a leadership or management tier (e.g., "Team Lead", "Manager"), down-level the suggested title to the appropriate technical tier (e.g., "Senior React Developer"). A lead encompasses senior execution capabilities.
            3. **Tech Stack Injection:** If the target job specifically names a technology stack (e.g., "React", "TypeScript") and the past role's accomplishments verify active usage of that stack, inject the keyword directly into the suggested title.
            4. **Vocabulary Alignment:** Match designator styles if appropriate (e.g., shifting "Frontend Developer" to "UI Engineer" if the target role consistently favors engineering language).

            ### TARGET PROSPECTIVE JOB DETAILS:
            - Title: ${target_job.role_title}
            - Description Text:
            \`\`\`text
            ${target_job.description}
            \`\`\`

            ### SOURCE HISTORICAL JOB TO TAILOR (JSON):
            \`\`\`json
            ${JSON.stringify(job_summary, null, 2)}
            \`\`\`
          `;
      res = await this.Prompt(prompt, schema);
    }

    return res;
  }

  /**
   * Converts a millisecond timestamp to a standard YYYY-MM-DD date string.
   * @param {number} ms - Millisecond timestamp.
   * @returns {string} The formatted date string.
   */
  static To_AI_Date(ms)
  {
    return new Date(ms).toISOString().split('T')[0];
  }

  /**
   * Sends a structured generation request to the AI model.
   * @param {string} prompt - The user prompt.
   * @param {Object | null} [schema] - Optional response schema for structured JSON output.
   * @param {{ mime_type: string, data: string } | null} [file] - Optional inline file attachments.
   * @param {string | null} [sys_instruction] - Optional system instructions.
   * @returns {Promise<any>} The parsed JSON object response (if schema is specified) or raw text response.
   */
  async Prompt(prompt, schema, file, sys_instruction)
  {
    //console.log("AI.Prompt(): entry");

    const model_config =
    {
      //model: "gemini-2.5-flash-lite",
      model: "gemini-2.5-flash",
      generationConfig:
      {
        temperature: 0.1
      },
      requestOptions:
      {
        timeout: 120000
      }
    };

    if (schema)
    {
      model_config.generationConfig.responseSchema = schema;
      model_config.generationConfig.responseMimeType = "application/json";
    }
    if (sys_instruction)
    {
      model_config.systemInstruction = sys_instruction;
    }

    let model = null;
    try { model = this.fb_ai.getGenerativeModel(this.ai, model_config); }
    catch (error)
    {
      console.warn(error);
      model = null;
    }

    let prompt_res = null;
    if (model)
    {
      let result = null;
      if (file)
      {
        const inlineData = { mimeType: file.mime_type, data: file.data };
        result = await model.generateContent([prompt, { inlineData }]);
      }
      else
      {
        result = await model.generateContent(prompt);
      }

      if (result)
      {
        const text_res = result.response.text();
        prompt_res = text_res;

        if (schema)
        {
          try { prompt_res = JSON.parse(text_res); }
          catch (error)
          {
            console.warn(error);
            console.warn("Prompt(): text_res =", text_res);
            prompt_res = null;
          }
        }
      }
    }

    return prompt_res;
  }

  static Clean_Empty_Fields(obj)
  {
    if (obj)
    {
      // Post-processing cleanup to guarantee no "null" or "undefined" strings leak through
      for (const [key, value] of Object.entries(obj))
      {
        if (typeof value === "string")
        {
          const trimmed = value.trim().toLowerCase();
          if (trimmed === "null" || trimmed === "undefined" || trimmed === "n/a" || trimmed === "")
          {
            obj[key] = null;
          }
        }
      }
    }
  }
}

export default AI;