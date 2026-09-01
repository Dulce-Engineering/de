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
  start_date?: number | string | null;
  end_date?: number | string | null;
  work_type?: 'full-time' | 'part-time' | 'contract' | 'temp' | 'casual' | 'internship' | 'volunteer' | 'vacation' | 'other' | string | null;
  location?: string | null;
  summary?: string | null;
  company_description?: string | null;
  tech?: string | null;
  responsibilities?: string | null;
  projects?: string | null;
}

interface CareerJobInput {
  role_titles: string | null;
  company?: string | null;
  company_name?: string | null;
}

interface CareerJobRecord extends CareerJobInput, CareerJobDetails {
  id?: number | string;
}

interface EducationDetails {
  id?: number | string;
  title: string | null;
  institution: string | null;
  year: number | string | null;
}

type EducationRecord = EducationDetails;

interface UserProfile {
  id?: number | string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  url?: string | null;
  residency_status?: string | null;
  seek_url?: string | null;
  linkedin_url?: string | null;
  personal_summary?: string | string[] | null;
  skills?: string | string[] | null;
  interests?: string | string[] | null;
}

interface ExtractedCVResult {
  educations: EducationDetails[];
  career: Array<CareerJobInput & CareerJobDetails>;
}

interface FullProfile extends UserProfile {
  work_history?: Array<CareerJobRecord>;
  job_history?: Array<CareerJobRecord>;
  education?: Array<EducationRecord>;
}
