# ATS, Resume Parsing & AI Screening Heuristics Reference
**Target Project:** `jopr` (CV Generator PWA)  
**Purpose:** Architectural and prompt/template optimization guide based on industry-standard Applicant Tracking Systems (ATS), CV parsers, and AI candidate-matching engines.

---

## 1. The Recruitment Software Stack

When a CV is submitted, it typically passes through up to four distinct software layers before a human recruiter reviews it:

| Layer | Function | Representative Platforms |
| :--- | :--- | :--- |
| **Applicant Tracking System (ATS)** | Central candidate database, workflow management, Boolean search, and knockout filtering. | Workday, Greenhouse, Lever, Bullhorn, JobAdder, Zoho Recruit |
| **Resume / CV Parser** | Ingests unstructured files (`.pdf`, `.docx`) and maps text into structured JSON/XML fields (Work History, Dates, Titles, Skills, Education). | Textkernel, Sovren, RChilli, DaXtra |
| **AI Candidate Screening & Talent Intelligence** | Semantic matching and ranking engine using vector embeddings and knowledge graphs to score CVs against job descriptions. | Eightfold AI, Phenom, HireVue, Seek Recruiter Match |
| **Recruitment CRM** | Agency talent pool database that matches incoming job briefs against historical candidate profiles. | Bullhorn, Vincere, Tracker |

> **Key Architectural Takeaway for `jopr`:** Most systems do not auto-reject via a strict percentage cutoff. Instead, failure happens at **ingestion** (parser misreads layout/dates) or **retrieval** (candidate lacks the structured fields, recency signals, or semantic taxonomy links needed to surface in recruiter search filters).

---

## 2. Disclosed Evaluation Metrics & Scoring Heuristics

While exact ranking weights are proprietary trade secrets, enterprise documentation and regulatory explainability outputs (e.g., EU AI Act high-risk AI compliance) confirm four primary evaluation buckets:

### A. Recency & Duration Weighting (Temporal Decay)
Parsers like Textkernel and Sovren bind extracted skills to the date ranges of the specific employment block in which they appear:
* **Recency Decay:** Skills demonstrated in the most recent or current role carry significantly higher weight than skills listed only in older roles.
* **Cumulative Tenure Calculation:** Matching engines sum the months/years a skill is anchored to dated work blocks to validate "years of experience" filters.
* **Contextual Density:** A skill listed only in a standalone "Skills" section—with zero mentions inside dated experience bullets—receives low confidence/tenure weight compared to skills embedded in role descriptions.

### B. Semantic Proximity & Taxonomy Mapping
Modern screening platforms use skill ontologies and vector embeddings rather than pure exact-string matching:
* **Skill Graphs:** Adjacent technologies confer partial credit (e.g., matching *EC2, Lambda, S3, Terraform* strengthens affinity for a requirement asking for *AWS*).
* **Role-Title Normalization:** Job titles are mapped against standardized taxonomies (such as O*NET or proprietary equivalents) to evaluate seniority trajectory and functional equivalence (e.g., mapping *Staff Software Engineer* and *Principal Application Developer* to the same tier).

### C. Recruiter-Configured Weighted Criteria
On scoring platforms (e.g., iCIMS, Bullhorn, Seek), match percentages are often dynamically weighted per job requisition using recruiter-configured sliders across four standard buckets:
1. **Must-Have / Core Skills** (typically highest weight, ~40–50%)
2. **Job Title & Seniority Alignment** (~20%)
3. **Years of Relevant Experience** (~20%)
4. **Education / Certifications** (~10%)

### D. Explainability Feature Attributions
Modern screening UIs surface post-hoc reason codes to recruiters rather than opaque scores:
* Explicit **Matched vs. Missing Competencies** lists.
* **Seniority / Trajectory Alignment** indicators.
* **Domain / Industry Overlap** (comparing past employer industry classifications against the hiring organization).

---

## 3. Undisclosed / Implicit Negative Heuristics

Vendors rarely publish penalty formulas, but parsing behaviors and recruiter filtering patterns reveal common ranking depressors:
* **Orphaned Skills:** Dumping keywords in a header/footer or isolated comma-separated list without supporting context in dated employment blocks.
* **Unparseable Date Formats or Multi-Column Layouts:** Tables, text boxes, icons, and complex multi-column grids cause parsers to scramble chronological boundaries, breaking skill-to-date attribution.
* **Non-Standard Section Headers:** Creative headers (e.g., *"Where I've Made Impact"* instead of *"Work Experience"*) risk misclassifying entire sections during ingestion.
* **Title Mismatch:** Hyper-internal or quirky job titles (e.g., *"Code Ninja"*, *"Product Evangelist"*) fail taxonomy normalization unless paired with a standard market equivalent.

---

## 4. Actionable Fine-Tuning Rules for `jopr`

Use the following rules to govern `jopr`'s AI tailoring logic, structured data schema, and PDF/DOCX export templates:

### 1. Data & Prompt Generation Rules (Tailoring Engine)
* **Anchor Every Priority Skill to Recent Roles:** When tailoring a CV to a job description, ensure top-priority skills from the target JD appear explicitly inside the bullet points of the **1–2 most recent roles**, not just in a top-level skills summary.
* **Dual-Form Terminology (Exact + Canonical):** Include both the exact phrasing from the job posting and standard industry canonical terms/acronyms (e.g., `"Continuous Integration / Continuous Deployment (CI/CD)"` or `"Amazon Web Services (AWS)"`) to satisfy both strict Boolean queries and semantic embeddings.
* **Normalize Job Titles Safely:** Preserve the user's true title while optionally appending a standardized taxonomy title in parentheses if the original title is non-standard (e.g., `Member of Technical Staff (Senior Backend Engineer)`).
* **Surface Domain & Seniority Signals:** Explicitly reflect industry vertical terms (e.g., *FinTech, B2B SaaS, Healthcare*) and scope/seniority markers (e.g., *architected, led, cross-functional, P&L*) within role summaries.

### 2. Document Layout & Export Rules (Parser Compatibility)
* **Strict Single-Column DOM Flow for Export:** Even if the PWA preview looks sleek, ensure the underlying PDF/DOCX text layer reads linearly from top to bottom without floating text boxes or multi-column tables that interleave unrelated lines.
* **Standardized Section Headings:** Enforce canonical headings in exported templates (`Summary`, `Experience`, `Skills`, `Education`, `Certifications`).
* **Machine-Readable Dates:** Format all employment and education dates consistently using standard month-year syntax (`MMM YYYY – MMM YYYY` or `MM/YYYY – Present`) right-aligned or directly beneath the role header so parsers cleanly bind skill tenure.
* **Zero Critical Text in Headers/Footers or SVGs:** Keep contact info, links, and skill tags in standard selectable body text; many parsers ignore document headers/footers and rasterized/SVG graphics entirely.