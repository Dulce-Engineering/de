# Profile Page — Functional Specification

## Purpose
The **Profile Page** provides a dedicated workspace for viewing and managing a single candidate profile and all of its associated professional background records. It serves as the source of truth for the candidate's personal details, qualifications, employment history, and portfolio projects used across JOPR (such as when tailoring CVs and cover letters for job applications).

---

## Core Functional Areas & Displayed Information

### 1. Personal & Professional Profile Details
Loads the specific profile requested via the page context (`profile_id`), or falls back to the primary/active profile when none is specified, and displays its core identity and summary attributes:
- **Profile Title & Active Status**: Identifier for the profile (e.g., role-specific persona) and whether it is the currently active profile.
- **Contact & Identity Details**: Full name, email address, phone number, physical/postal address, and residency/work authorization status.
- **External Links**: Personal website/portfolio URL, Seek profile URL, and LinkedIn profile URL.
- **Professional Narrative & Attributes**: Personal summary/attributes, technical/professional skills, and personal interests.

### 2. Education & Certifications
Displays a chronological list of the candidate's academic qualifications, degrees, and certifications associated with the profile:
- **Qualification Title**
- **Institution / Issuing Organization**
- **Completion Year**

### 3. Career & Work History
Displays a reverse-chronological history of employment roles associated with the profile:
- **Company Name & Description**
- **Role Title, Work Type, & Location** (e.g., Full-time, Contract, Remote/City)
- **Employment Time Span** (Start date, end date, and calculated duration)
- **Role Summary**
- **Technologies & Software Used**
- **Responsibilities & Duties**
- **Key Projects, Achievements, & Accomplishments**

### 4. Portfolio Projects
Displays a collection of standalone personal or professional projects:
- **Project Title**
- **Project URL / Link**
- **Description**
- **Technologies Used**

---

## Available User Actions

### Profile Actions
- **View Profile Details**: Inspect all personal, contact, link, and summary attributes of the profile.
- **Edit Profile Details**: Modify any of the profile's personal information, links, skills, summary, or active status and persist changes.
- **Export Profile Dossier**: Download a portable file containing the profile's details, education history, and career history.

### Education Actions
- **View Education History**: Browse all qualifications and certificates linked to the profile.
- **Add Education Entry**: Record a new qualification or certificate (title, institution, year) for the profile.
- **Edit Education Entry**: Update the details of an existing qualification or certificate.
- **Delete Education Entry**: Remove an education or certificate record (with confirmation).

### Career History Actions
- **View Career History**: Browse all past and current employment roles and their detailed descriptions.
- **Add Career Role**: Record a new work experience entry (company, title, work type, location, dates, summary, company description, technologies, responsibilities, and achievements) for the profile.
- **Edit Career Role**: Update any details of an existing work experience entry.
- **Delete Career Role**: Remove a work experience entry from the profile (with confirmation).

### Project Actions
- **View Projects**: Browse all portfolio projects and their details.
- **Add Project**: Create a new portfolio project entry (title, URL, description, technologies).
- **Edit Project**: Modify the details of an existing project.
- **Delete Project**: Remove a project from the portfolio (with confirmation).

