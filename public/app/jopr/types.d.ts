interface Context {
  ai: import("./lib/AI.js").default;
  db: import("./lib/Db.js").default;
  db2: import("./lib/Db.js").default;
  Agency: typeof import("./lib/Agency.js").default;
  Contact: typeof import("./lib/Contact.js").default;
  Job: typeof import("./lib/Job.js").default;
  Profile: typeof import("./lib/Profile.js").default;
  Utils: typeof import("../../lib/Utils.js").default;
  Project: typeof import("./lib/Project.js").default;
}

interface HTMLElementTagNameMap {
  "de-project-list": import("./component/de-project-list/index.js").default;
}

interface ContactDetails {
  email?: string;
  name?: string;
  phone?: string;
  position?: string;
}

interface AgencyDetails {
  address?: string;
  email?: string;
  industry?: string;
  name?: string;
  phone?: string;
  url?: string;
}

interface JobDetails {
  company?: string;
  duration?: string;
  location?: string;
  remuneration?: number;
  remuneration_unit?: string;
  role_title: string;
  role_type?: string;
  description?: string;
}

interface ExtractedJobResult {
  agency: AgencyDetails | null;
  contact: ContactDetails | null;
  job: JobDetails;
}

interface CareerJobDetails {
  start_date?: string;
  end_date?: string;
  work_type?: string;
  location?: string;
  tech?: string;
  responsibilities?: string;
  projects?: string;
}

interface CareerJobInput {
  role_titles: string;
  company?: string;
  company_name?: string;
}

interface EducationDetails {
  title: string;
  institution: string;
  year: number | null;
}

interface ExtractedCVResult {
  educations: EducationDetails[];
  career: Array<CareerJobInput & CareerJobDetails>;
}

interface FullProfile {
  id: number | string;
  name: string;
  email?: string;
  phone?: string;
  linkedin_url?: string;
  seek_url?: string;
  personal_summary?: string;
  skills?: string;
  work_history?: Array<any>;
  education?: Array<any>;
}
