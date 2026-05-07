# JobApply Agent Design

Date: 2026-05-07

## Goal

JobApply Agent is a GitHub-showcase MVP for AI-assisted job applications. It helps a job seeker turn a resume and a target job description into a structured application package: match report, resume improvement suggestions, a tailored cover letter, interview preparation, and a follow-up checklist.

The project is designed for application review. It should be easy to understand from the README, easy to run locally, and complete enough to demonstrate an Agent-driven workflow without requiring a full production SaaS system.

## Problem

Job seekers often spend significant time reading job descriptions, identifying required skills, adapting resumes, writing cover letters, and preparing for interviews. This process is repetitive, hard to personalize at scale, and easy to do poorly when the candidate does not know which parts of their background are most relevant to a role.

The MVP addresses this by converting unstructured resume and job description text into a guided, explainable application workflow.

## Target User

The primary user is an early-career job seeker or internship applicant who wants to apply to a specific role more effectively. They may not know how to map their existing experience to the role, what keywords are missing, or what interview questions to prepare for.

## MVP Scope

The MVP includes:

- A lightweight web demo for entering resume text and a job description.
- Built-in sample resume and job description data for immediate GitHub demo use.
- A mock mode that works without an API key.
- An optional LLM mode for real model output when an API key is configured.
- A structured application package with match report, resume suggestions, cover letter, interview questions, and follow-up checklist.
- Documentation that explains the Agent workflow, architecture, local setup, sample input/output, ethical boundaries, and future work.

The MVP does not include:

- User accounts.
- Persistent databases.
- Job board scraping.
- Automated job applications.
- Long-term application tracking.
- Fabricated work experience or dishonest resume rewriting.

## Recommended Tech Stack

- Frontend: React, Vite, TypeScript.
- Styling: plain CSS modules.
- Local API: a small Node/Express server used only for optional LLM calls.
- Agent modules: TypeScript functions in `src/agents/`.
- Shared types and validation: TypeScript interfaces in `src/lib/schemas.ts`.
- LLM abstraction: `src/lib/llmClient.ts`.
- Demo fixtures: markdown and JSON files in `examples/`.
- Documentation: `README.md` plus focused docs in `docs/`.

This stack keeps the project approachable on GitHub while still showing clear engineering structure.

## Repository Shape

```text
JobApply-Agent/
  README.md
  package.json
  index.html
  vite.config.ts
  docs/
    architecture.md
    agent-flow.md
    superpowers/
      specs/
        2026-05-07-jobapply-agent-design.md
  examples/
    resume_sample.md
    jd_sample.md
    output_sample.json
  server/
    index.ts
  src/
    agents/
      jdParserAgent.ts
      resumeAnalyzerAgent.ts
      matchingAgent.ts
      materialWriterAgent.ts
      interviewCoachAgent.ts
    lib/
      apiClient.ts
      llmClient.ts
      schemas.ts
      scoring.ts
      mockOutput.ts
    components/
      InputPanel.tsx
      ResultTabs.tsx
      MatchReport.tsx
      ResumeSuggestions.tsx
      CoverLetter.tsx
      InterviewPrep.tsx
    App.tsx
  .env.example
```

## User Experience

The first screen should be the usable product, not a marketing page.

The page contains:

- A resume input panel.
- A job description input panel.
- Buttons to load sample data and generate the application package.
- A visible mode indicator for mock mode or LLM mode.
- Result tabs for Match Report, Resume Suggestions, Cover Letter, Interview Prep, and Checklist.

Default sample data should make the project immediately usable after installation. A reviewer should be able to run the app, click "Load sample", click "Generate", and see a complete result.

## Agent Workflow

The system follows a sequential Agent pipeline:

```text
Resume + Job Description
  -> JD Parser Agent
  -> Resume Analyzer Agent
  -> Matching Agent
  -> Material Writer Agent
  -> Interview Coach Agent
  -> Application Package
```

### JD Parser Agent

The JD Parser Agent converts a job description into structured role requirements.

Expected output:

- Role title.
- Required skills.
- Preferred skills.
- Responsibilities.
- Keywords.
- Experience expectations.
- Signals that may matter for interview preparation.

### Resume Analyzer Agent

The Resume Analyzer Agent converts a resume into a structured candidate profile.

Expected output:

- Skills.
- Education.
- Projects.
- Work or internship experience.
- Strengths.
- Evidence from the resume.
- Missing signals that may matter for the target role.

### Matching Agent

The Matching Agent compares structured JD data with structured resume data.

Expected output:

- Match score.
- Covered skills.
- Missing skills.
- Strong evidence from the resume.
- Weak or underdeveloped evidence.
- Resume sections that should be improved first.
- Risks and honest preparation notes.

The score should be explainable. A simple deterministic scoring helper can combine skill coverage, project relevance, and keyword overlap. LLM output can explain the result, but the visible score should not depend entirely on opaque generation.

### Material Writer Agent

The Material Writer Agent produces practical application materials from the matching report.

Expected output:

- Resume bullet rewrite suggestions.
- Skill section improvement suggestions.
- Project framing suggestions.
- A tailored cover letter.

This Agent must preserve truthfulness. It can reframe real experience, improve clarity, and highlight relevant details, but it must not invent projects, employers, degrees, certifications, or outcomes.

### Interview Coach Agent

The Interview Coach Agent turns the match report into preparation material.

Expected output:

- Role-specific interview questions.
- Resume-based follow-up questions.
- Behavioral questions.
- Answer hints.
- A short preparation plan.

## Final Application Package

The app should merge Agent outputs into one object:

```json
{
  "match_report": {
    "score": 78,
    "summary": "The candidate has strong frontend project evidence but should strengthen TypeScript and testing signals.",
    "covered_skills": ["React", "JavaScript", "CSS"],
    "missing_skills": ["TypeScript", "Testing"],
    "risks": ["The JD asks for TypeScript, but the resume does not mention it."]
  },
  "resume_suggestions": [],
  "cover_letter": "",
  "interview_questions": [],
  "follow_up_checklist": []
}
```

The exact schema can evolve during implementation, but the MVP should keep these top-level sections stable so the UI and sample output remain predictable.

## Modes

### Mock Mode

Mock mode is the default. It requires no API key and returns curated sample output from `examples/output_sample.json` or `src/lib/mockOutput.ts`.

This mode exists so GitHub reviewers can experience the full workflow without external setup.

### LLM Mode

LLM mode is enabled when the required environment variable is configured on the local Node server. The browser should not directly store or send a provider API key. The app calls the local API through `src/lib/apiClient.ts`, and the server calls the LLM client through a single abstraction so the model provider can be changed later.

The UI should clearly indicate when real model output is being used.

## Error Handling

The MVP should handle:

- Empty resume or JD input by asking the user to provide content.
- Very short input by warning that the analysis may be weak.
- Missing API key by using mock mode.
- LLM request failure by falling back to mock mode and showing a non-blocking notice.
- Invalid or unparseable model JSON by showing the raw text with a structured parsing warning.

Errors should not crash the demo path.

## Testing

Testing should focus on the core credibility of the project:

- Schema tests for Agent outputs.
- Scoring tests for deterministic match-score behavior.
- Mock mode tests to ensure the app works without an API key.
- Basic UI smoke tests for entering input, generating output, and switching result tabs.

The first implementation can use unit tests for the non-UI logic and a lightweight manual QA checklist documented in the README.

## README Requirements

The README should be a major part of the GitHub showcase. It should include:

- Project summary.
- Problem statement.
- Demo screenshot or GIF.
- Agent workflow diagram.
- Feature list.
- Local setup instructions.
- Mock mode explanation.
- Optional LLM mode setup.
- Sample input and output.
- Ethical design statement.
- Future work.

Recommended ethical design statement:

> The system does not fabricate experience. It helps users reframe real experience, identify gaps, and prepare honestly for applications.

## Success Criteria

The MVP is successful when:

- A reviewer can understand the project from the README in under two minutes.
- A reviewer can run the demo locally without an API key.
- The sample workflow produces a complete application package.
- The code clearly separates each Agent role.
- The project demonstrates structured AI reasoning rather than a single generic text-generation prompt.
- The design makes truthful and ethical job application support explicit.

## Future Work

After the showcase MVP, useful extensions include:

- PDF and DOCX resume parsing.
- Multiple resume versions per job family.
- Job application tracking.
- RAG over a user's past projects and portfolio.
- Interview answer practice with feedback.
- Export to markdown or PDF.
- Integration with job boards, if done with user consent and clear rate limits.
