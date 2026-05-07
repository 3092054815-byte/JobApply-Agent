# Agent Flow

JobApply Agent uses a sequential Agent pipeline. Each Agent has one focused responsibility and passes structured output to the next step.

```text
Resume + Job Description
  -> JD Parser Agent
  -> Resume Analyzer Agent
  -> Matching Agent
  -> Material Writer Agent
  -> Interview Coach Agent
  -> Application Package
```

## Agents

| Agent | Responsibility | Output |
| --- | --- | --- |
| JD Parser Agent | Extract role requirements, skills, responsibilities, and keywords. | `ParsedJobDescription` |
| Resume Analyzer Agent | Extract candidate skills, education, projects, strengths, and missing signals. | `ParsedResume` |
| Matching Agent | Compare job requirements to resume evidence and generate an explainable score. | `MatchReport` |
| Material Writer Agent | Suggest truthful resume improvements and produce a tailored cover letter. | `ResumeSuggestion[]`, `coverLetter` |
| Interview Coach Agent | Generate interview questions, answer hints, and a follow-up checklist. | `InterviewQuestion[]`, `followUpChecklist` |

The MVP implements the Agents as focused TypeScript modules rather than separate services. This keeps the demo reliable and easy to review while still showing clear Agent boundaries.

## Why This Is More Than One Prompt

Each stage produces a typed intermediate object. The UI can expose those intermediate decisions, and tests can verify the pipeline without depending on model output. Real LLM calls can later replace or enrich individual Agent modules without changing the whole product shape.
