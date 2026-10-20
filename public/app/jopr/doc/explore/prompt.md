**AI Prompt for Automated Question Generation**

```markdown
Act as a Principal Frontend Engineer and technical interviewer. I will provide two inputs: a candidate's CV/resume and a target Job Description. 

Your task is to analyze both documents, identify gaps where the candidate's explicit past experience falls short of the job's core requirements, and generate 20 targeted study questions with detailed answers.

Please follow these guidelines:
1. **Gap Analysis**: Compare the candidate's work history against the job requirements. Target tools, testing frameworks, design systems, modern architecture patterns, or APIs mentioned in the JD that are absent or underrepresented in the CV.
2. **Question Structure**: Group questions into logical technical categories (e.g., Testing, Architecture, Modern Framework Features, Integrations).
3. **Answer Depth**: Provide actionable, concise, senior-level answers that explain *how* and *why* to implement the solution, including key trade-offs.
4. **Tone**: Objective, technical, and practical for interview preparation.

[INPUT 1: JOB DESCRIPTION]
<Paste job description text here>

[INPUT 2: CANDIDATE CV]
<Paste candidate CV text here>

```

**Implementation Tips for Your App**

* **Context Truncation**: Standard LLMs can struggle if the CV is excessively long. Extracting key sections—such as **Technical Skills**, **Responsibilities**, and **Projects**—before injecting the CV into the prompt will save tokens and improve response quality.
* **Structured Output**: If you want your app to render these dynamically in a UI, ask the model to return the output as a JSON schema (e.g., `{ category: string, question: string, answer: string }[]`).