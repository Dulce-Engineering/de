class AI
{
  static async New(fb_app, fb_ai)
  {
    let res = null;
    const response = await fetch("/__/firebase/init.json");
    if (response.ok)
    {
      const fb_config = await response.json();
      console.info("Init_AI(): fb_config =", fb_config);
      const app = fb_app.initializeApp(fb_config);

      res = new AI();
      res.fb_ai = fb_ai;
      res.fb_app = app;
      res.ai = fb_ai.getAI(app, { backend: new fb_ai.GoogleAIBackend() });
    }

    return res;
  }

  async Extract_Job(text)
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
      "Analyze the following text about a job opportunity and extract the job " +
      "description, technical requirements, and responsibilities, if available. " +
      "If available, make sure to include a list of the technical skills required " +
      "for the job and a list of the responsibilities. " +
      "Job details follow: /n" + text;
    const details = await this.Prompt(prompt, details_schema);
    job.description = details.description;

    return { agency, contact, job };
  }

  async Extract_Career_Job(job, file)
  {
    console.info("Processing job " + job.role_titles + "...");
    const career_schema =
    {
      type: "array",
      items:
      {
        type: "object",
        properties:
        {
          start_date:
          {
            type: "string",
            description: "The starting date of the role in ISO format (YYYY-MM-DD) if available, or just the year (YYYY) if the full date cannot be determined."
          },
          end_date:
          {
            type: "string",
            description: "The ending date of the role in ISO format (YYYY-MM-DD) if available, or just the year (YYYY) if the full date cannot be determined."
          },
          work_type:
          {
            type: "string",
            description: "The type of work performed (e.g., full-time, part-time, contract).",
            enum: ["full-time", "part-time", "contract", "temp", "casual", "internship", "volunteer", "vacation", "other"],
          },
          location:
          {
            type: "string",
            description: "The location of the role. This could be a city, state, or country depending on the level of detail available in the CV."
          },
          tech:
          {
            type: "string",
            description: "The technologies or tools used in the role. This could include programming languages, software, methodologies, or any other relevant technical skills mentioned in the CV."
          },
          responsibilities:
          {
            type: "string",
            description: "The responsibilities and achievements in the role."
          },
          projects:
          {
            type: "string",
            description: "The projects worked on in the role."
          },
        },
      }
      //required: ["role_titles", "company_name"]
    };
    const prompt =
      "From the given CV document extract the deatils of the job titled " + job.role_titles + " at company " + job.company + ". " +
      "Return a job object with start_date, end_date, work_type, location, tech, responsibilities, and projects.";
    const job_details = await this.Prompt(prompt, career_schema, file);
    console.log("Extract_Career_Job(): Extracted job_details:", job_details);
    console.info("...Finished.");

    return job_details && job_details.length > 0 ? job_details[0] : null;
  }

  async Extract_CV(cv_blob)
  {
    const base64 = await Blob_To_Base64(cv_blob);

    console.info("Processing educations...");
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
    console.log("Extract_CV(): Extracted educations:", educations);
    console.info("...Finished.");

    console.info("Processing career...");
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
    console.log("Extract_CV(): Extracted career:", career);
    console.info("...Finished.");

    for (const job of career)
    {
      const job_data = await this.Extract_Career_Job(job, file);
      Object.assign(job, job_data);
    }

    return { educations, career };
  }

  async Prompt(prompt, schema, file, sys_instruction)
  {
    console.log("AI.Prompt(): entry");

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
}

export default AI;