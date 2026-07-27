
const DB_SCHEMA = 
{
  name: 'JobTrakDB',
  version: 5,
  stores: 
  {
    action_logs: 
    {
      keyPath: 'id',
      autoIncrement: false,
      // indices: [ { name: 'authorId', unique: false }, ... ]
      fields:
      {
        id: "int",
        job_id: "int",
        note: "string",
        time_str: "string",
        timestamp: "int",
      }
    },
    agencies: 
    {
      keyPath: 'id',
      autoIncrement: false,
      //indices: []
      fields:
      {
        id: "int",
        address: "string",
        email: "string",
        industry: "string",
        name: "string",
        phone: "string",
        url: "string"
      }
    },
    attachments:
    {
      keyPath: 'id',
      autoIncrement: false,
      //indices: []
      fields:
      {
        id: "int",
        file: "File",
        job_id: "int",
        timestamp: "int"
      }
    },
    contacts:
    {
      keyPath: 'id',
      autoIncrement: false,
      //indices: []
      fields:
      {
        id: "int",
        agency_id: "int",
        email: "string",
        name: "string",
        phone: "string",
        position: "string",
        linkedin: "string"
      }
    },
    jobs:
    {
      keyPath: 'id',
      autoIncrement: false,
      //indices: []
      fields:
      {
        id: "int",
        agency_id: "int",
        company: "string",
        contact_id: "int",
        description: "string",
        duration: "string",
        location: "string",
        remuneration: "float",
        remuneration_unit: "string",
        role_title: "string",
        role_type: "string",
        source: "string",
        status: "string",
        link: "string",
        last_update: "int",
      }
    },
    profiles:
    {
      keyPath: 'id',
      autoIncrement: false,
      //indices: []
      fields:
      {
        id: "int",
        name: "string",
        address: "string",
        seek_url: "string",
        linkedin_url: "string",
        residency_status: "string",
        personal_summary: "string[]",
        skills: "string[]",
        interests: "string[]",
        email: "string",
        phone: "string",
        url: "string",
      }
    },
    education:
    {
      keyPath: 'id',
      autoIncrement: false,
      //indices: []
      fields:
      {
        id: "int",
        title: "string",
        institution: "string",
        year: "int",
      }
    },
    career:
    {
      keyPath: 'id',
      autoIncrement: false,
      //indices: []
      fields:
      {
        id: "int",
        role_titles: "string",
        company_name: "string",
        start_date: "int",
        end_date: "int",
        work_type: "string",
        location: "string",
        tech: "string",
        responsibilities: "string",
        projects: "string"
      }
    },
    projects:
    {
      keyPath: 'id',
      autoIncrement: false,
      fields:
      {
        id: "int",
        title: "string",
        url: "string",
        description: "string",
        tech: "string",
      }
    }
  }
};

export default DB_SCHEMA;
