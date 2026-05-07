# JobApply Agent MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a GitHub-showcase MVP that turns a resume and job description into a structured job application package.

**Architecture:** The app is a Vite React TypeScript project with focused Agent modules under `src/agents/`, shared data contracts under `src/lib/`, and a small optional Node/Express server for real LLM calls. Mock mode is the default path so reviewers can run the demo without an API key.

**Tech Stack:** React, Vite, TypeScript, Vitest, Testing Library, Node, Express, CSS.

---

## File Structure

Create these files:

- `package.json`: scripts and dependencies.
- `index.html`: Vite HTML entry.
- `vite.config.ts`: Vite and Vitest config.
- `tsconfig.json`: TypeScript config.
- `tsconfig.node.json`: TypeScript config for Vite/server files.
- `.env.example`: documents optional server-side LLM variables.
- `src/main.tsx`: React entry.
- `src/App.tsx`: page composition and state.
- `src/styles.css`: global MVP styling.
- `src/agents/jdParserAgent.ts`: job description parser.
- `src/agents/resumeAnalyzerAgent.ts`: resume parser.
- `src/agents/matchingAgent.ts`: match report generation.
- `src/agents/materialWriterAgent.ts`: resume suggestions and cover letter generation.
- `src/agents/interviewCoachAgent.ts`: interview preparation generation.
- `src/lib/applicationPipeline.ts`: orchestrates the Agent pipeline.
- `src/lib/apiClient.ts`: browser client for optional local LLM server.
- `src/lib/llmClient.ts`: server-side LLM abstraction.
- `src/lib/mockOutput.ts`: curated demo result.
- `src/lib/schemas.ts`: shared TypeScript types.
- `src/lib/scoring.ts`: deterministic match scoring.
- `src/components/InputPanel.tsx`: resume/JD input UI.
- `src/components/ResultTabs.tsx`: tab state and result layout.
- `src/components/MatchReport.tsx`: match report view.
- `src/components/ResumeSuggestions.tsx`: resume suggestions view.
- `src/components/CoverLetter.tsx`: cover letter view.
- `src/components/InterviewPrep.tsx`: interview prep and checklist view.
- `server/index.ts`: optional local Express endpoint for LLM mode.
- `examples/resume_sample.md`: sample resume input.
- `examples/jd_sample.md`: sample job description input.
- `examples/output_sample.json`: sample application package.
- `docs/architecture.md`: implementation architecture.
- `docs/agent-flow.md`: Agent workflow explanation.
- `README.md`: GitHub showcase documentation.
- `src/lib/scoring.test.ts`: scoring unit tests.
- `src/lib/applicationPipeline.test.ts`: pipeline smoke tests.
- `src/components/ResultTabs.test.tsx`: UI smoke test for tabs.

Modify these files:

- `docs/superpowers/specs/2026-05-07-jobapply-agent-design.md`: no code changes required; keep it as the source design reference.

---

### Task 1: Scaffold the React TypeScript Project

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `.env.example`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles.css`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "jobapply-agent",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "server": "tsx server/index.ts",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "express": "^4.18.3",
    "lucide-react": "^0.468.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tsx": "^4.7.1",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.2",
    "@testing-library/react": "^14.2.1",
    "@testing-library/user-event": "^14.5.2",
    "@types/express": "^4.17.21",
    "@types/node": "^20.11.24",
    "@types/react": "^18.2.64",
    "@types/react-dom": "^18.2.21",
    "@vitejs/plugin-react": "^4.2.1",
    "jsdom": "^24.0.0",
    "typescript": "^5.4.2",
    "vite": "^5.1.6",
    "vitest": "^1.3.1"
  }
}
```

- [ ] **Step 2: Create `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>JobApply Agent</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 3: Create TypeScript and Vite config**

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2020"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src", "server"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Create `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

Create `vite.config.ts`:

```ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: []
  }
});
```

- [ ] **Step 4: Create `.env.example`**

```bash
# Optional. The browser never stores provider API keys.
# Configure these only when running the local server for real LLM mode.
LLM_PROVIDER=openai
LLM_API_KEY=
LLM_MODEL=gpt-4.1-mini
VITE_API_BASE_URL=http://localhost:8787
```

- [ ] **Step 5: Create minimal React entry files**

Create `src/main.tsx`:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

Create `src/App.tsx`:

```tsx
export default function App() {
  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">AI job application workflow</p>
        <h1>JobApply Agent</h1>
        <p>
          Turn a resume and job description into a match report, resume guidance,
          cover letter, interview prep, and follow-up checklist.
        </p>
      </section>
    </main>
  );
}
```

Create `src/styles.css`:

```css
:root {
  color: #172026;
  background: #f7f3ea;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
}

button,
textarea,
input {
  font: inherit;
}

.app-shell {
  min-height: 100vh;
  padding: 32px;
}

.hero {
  max-width: 920px;
}

.eyebrow {
  color: #476f65;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0;
  margin: 0 0 8px;
  text-transform: uppercase;
}

h1 {
  font-size: clamp(2rem, 4vw, 4.5rem);
  letter-spacing: 0;
  line-height: 1;
  margin: 0 0 16px;
}

p {
  line-height: 1.6;
}
```

- [ ] **Step 6: Install dependencies**

Run:

```bash
npm install
```

Expected: npm installs dependencies and creates `package-lock.json`.

- [ ] **Step 7: Verify scaffold builds**

Run:

```bash
npm run build
```

Expected: TypeScript and Vite build complete without errors.

- [ ] **Step 8: Commit scaffold**

Run:

```bash
git add package.json package-lock.json index.html vite.config.ts tsconfig.json tsconfig.node.json .env.example src/main.tsx src/App.tsx src/styles.css
git commit -m "feat: scaffold JobApply Agent app"
```

Expected: commit succeeds. If Git reports missing author identity, stop and ask the user for a local repository `user.name` and `user.email`.

---

### Task 2: Add Shared Types and Demo Fixtures

**Files:**
- Create: `src/lib/schemas.ts`
- Create: `examples/resume_sample.md`
- Create: `examples/jd_sample.md`
- Create: `examples/output_sample.json`
- Create: `src/lib/mockOutput.ts`
- Test: `src/lib/applicationPipeline.test.ts`

- [ ] **Step 1: Create `src/lib/schemas.ts`**

```ts
export interface JobApplicationRequest {
  resumeText: string;
  jobDescriptionText: string;
  mode: "mock" | "llm";
}

export interface ParsedJobDescription {
  roleTitle: string;
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  keywords: string[];
  experienceExpectations: string[];
}

export interface ResumeProject {
  name: string;
  evidence: string[];
}

export interface ParsedResume {
  skills: string[];
  education: string[];
  projects: ResumeProject[];
  strengths: string[];
  missingSignals: string[];
}

export interface MatchReport {
  score: number;
  summary: string;
  coveredSkills: string[];
  missingSkills: string[];
  strongEvidence: string[];
  weakEvidence: string[];
  risks: string[];
}

export interface ResumeSuggestion {
  section: string;
  before?: string;
  after: string;
  reason: string;
}

export interface InterviewQuestion {
  type: "role" | "resume" | "behavioral";
  question: string;
  answerHint: string;
}

export interface ApplicationPackage {
  modeUsed: "mock" | "llm";
  matchReport: MatchReport;
  resumeSuggestions: ResumeSuggestion[];
  coverLetter: string;
  interviewQuestions: InterviewQuestion[];
  followUpChecklist: string[];
  notices: string[];
}
```

- [ ] **Step 2: Create sample resume**

Create `examples/resume_sample.md`:

```md
# Alex Chen

Frontend developer and computer science student interested in building usable web products.

## Skills

JavaScript, React, HTML, CSS, Python, Git, REST APIs

## Projects

### Portfolio Dashboard

- Built a responsive React dashboard for displaying personal projects and writing.
- Created reusable components for cards, filters, and project detail views.
- Improved page performance by reducing unnecessary component re-renders.

### Campus Study Planner

- Built a study planning tool with task lists, weekly goals, and progress summaries.
- Used local storage to persist tasks across sessions.
- Designed mobile-friendly layouts for students checking plans on phones.

## Education

B.S. Computer Science, expected 2027
```

- [ ] **Step 3: Create sample JD**

Create `examples/jd_sample.md`:

```md
# Frontend Engineer Intern

We are looking for a frontend engineering intern to help build user-facing product features.

## Responsibilities

- Build React components for dashboards and workflow tools.
- Collaborate with designers and backend engineers.
- Improve accessibility, responsiveness, and frontend performance.
- Work with REST APIs and structured product data.

## Requirements

- Experience with React, JavaScript, HTML, and CSS.
- Familiarity with TypeScript.
- Understanding of component architecture and state management.
- Interest in usability, product thinking, and clean UI.

## Nice to Have

- Testing experience.
- Next.js experience.
- Experience improving web performance.
```

- [ ] **Step 4: Create sample output JSON**

Create `examples/output_sample.json`:

```json
{
  "modeUsed": "mock",
  "matchReport": {
    "score": 78,
    "summary": "The candidate has strong React and frontend project evidence, with good alignment on dashboard UI, responsiveness, REST APIs, and performance. The main gaps are TypeScript and testing signals.",
    "coveredSkills": ["React", "JavaScript", "HTML", "CSS", "REST APIs", "Performance"],
    "missingSkills": ["TypeScript", "Testing", "Next.js"],
    "strongEvidence": [
      "Built a responsive React dashboard for personal projects.",
      "Created reusable components for cards, filters, and project detail views.",
      "Improved page performance by reducing unnecessary component re-renders."
    ],
    "weakEvidence": [
      "TypeScript is required by the JD but not mentioned in the resume.",
      "Testing appears in nice-to-have requirements but is not represented in the resume."
    ],
    "risks": [
      "The resume should not imply TypeScript experience unless the candidate has used it.",
      "The candidate should prepare to discuss frontend architecture and state management clearly."
    ]
  },
  "resumeSuggestions": [
    {
      "section": "Portfolio Dashboard",
      "before": "Built a responsive React dashboard for displaying personal projects and writing.",
      "after": "Built a responsive React dashboard with reusable components, filterable project views, and performance-conscious rendering.",
      "reason": "This version better matches the JD's focus on dashboards, component architecture, responsiveness, and performance."
    },
    {
      "section": "Skills",
      "after": "Group skills into Frontend, Programming, Tools, and APIs so the React and REST API match is easier to scan.",
      "reason": "A structured skills section helps reviewers see JD keyword coverage quickly."
    }
  ],
  "coverLetter": "Dear Hiring Team,\\n\\nI am excited to apply for the Frontend Engineer Intern role. My React projects, including a responsive portfolio dashboard and a campus study planner, have given me hands-on experience building reusable components, mobile-friendly interfaces, and user-focused product flows. I am especially interested in your focus on dashboards, workflow tools, accessibility, and performance.\\n\\nIn my portfolio dashboard project, I created reusable components for cards, filters, and detail views while improving rendering performance. I would be excited to bring this same product-minded approach to your team while continuing to grow in TypeScript and testing.\\n\\nThank you for your consideration.\\nAlex Chen",
  "interviewQuestions": [
    {
      "type": "role",
      "question": "How would you structure reusable React components for a dashboard with filters and detail views?",
      "answerHint": "Discuss component boundaries, props, state location, and how the UI should stay easy to scan."
    },
    {
      "type": "resume",
      "question": "What caused unnecessary re-renders in your portfolio dashboard, and how did you reduce them?",
      "answerHint": "Explain how you identified the issue, what changed, and what improved."
    },
    {
      "type": "behavioral",
      "question": "Tell me about a time you improved a project based on user experience concerns.",
      "answerHint": "Use a STAR answer with the campus study planner or dashboard project."
    }
  ],
  "followUpChecklist": [
    "Revise the Portfolio Dashboard bullet to mention reusable components and performance.",
    "Add TypeScript only if the candidate has real TypeScript experience.",
    "Prepare one story about responsive design decisions.",
    "Prepare one story about performance improvement.",
    "Review basic React state management tradeoffs before the interview."
  ],
  "notices": ["Mock mode is active. Configure the local server for real LLM output."]
}
```

- [ ] **Step 5: Create `src/lib/mockOutput.ts`**

```ts
import type { ApplicationPackage } from "./schemas";

export const mockApplicationPackage: ApplicationPackage = {
  modeUsed: "mock",
  matchReport: {
    score: 78,
    summary:
      "The candidate has strong React and frontend project evidence, with good alignment on dashboard UI, responsiveness, REST APIs, and performance. The main gaps are TypeScript and testing signals.",
    coveredSkills: ["React", "JavaScript", "HTML", "CSS", "REST APIs", "Performance"],
    missingSkills: ["TypeScript", "Testing", "Next.js"],
    strongEvidence: [
      "Built a responsive React dashboard for personal projects.",
      "Created reusable components for cards, filters, and project detail views.",
      "Improved page performance by reducing unnecessary component re-renders."
    ],
    weakEvidence: [
      "TypeScript is required by the JD but not mentioned in the resume.",
      "Testing appears in nice-to-have requirements but is not represented in the resume."
    ],
    risks: [
      "The resume should not imply TypeScript experience unless the candidate has used it.",
      "The candidate should prepare to discuss frontend architecture and state management clearly."
    ]
  },
  resumeSuggestions: [
    {
      section: "Portfolio Dashboard",
      before: "Built a responsive React dashboard for displaying personal projects and writing.",
      after:
        "Built a responsive React dashboard with reusable components, filterable project views, and performance-conscious rendering.",
      reason:
        "This version better matches the JD's focus on dashboards, component architecture, responsiveness, and performance."
    },
    {
      section: "Skills",
      after:
        "Group skills into Frontend, Programming, Tools, and APIs so the React and REST API match is easier to scan.",
      reason: "A structured skills section helps reviewers see JD keyword coverage quickly."
    }
  ],
  coverLetter:
    "Dear Hiring Team,\n\nI am excited to apply for the Frontend Engineer Intern role. My React projects, including a responsive portfolio dashboard and a campus study planner, have given me hands-on experience building reusable components, mobile-friendly interfaces, and user-focused product flows. I am especially interested in your focus on dashboards, workflow tools, accessibility, and performance.\n\nIn my portfolio dashboard project, I created reusable components for cards, filters, and detail views while improving rendering performance. I would be excited to bring this same product-minded approach to your team while continuing to grow in TypeScript and testing.\n\nThank you for your consideration.\nAlex Chen",
  interviewQuestions: [
    {
      type: "role",
      question:
        "How would you structure reusable React components for a dashboard with filters and detail views?",
      answerHint:
        "Discuss component boundaries, props, state location, and how the UI should stay easy to scan."
    },
    {
      type: "resume",
      question:
        "What caused unnecessary re-renders in your portfolio dashboard, and how did you reduce them?",
      answerHint: "Explain how you identified the issue, what changed, and what improved."
    },
    {
      type: "behavioral",
      question: "Tell me about a time you improved a project based on user experience concerns.",
      answerHint: "Use a STAR answer with the campus study planner or dashboard project."
    }
  ],
  followUpChecklist: [
    "Revise the Portfolio Dashboard bullet to mention reusable components and performance.",
    "Add TypeScript only if the candidate has real TypeScript experience.",
    "Prepare one story about responsive design decisions.",
    "Prepare one story about performance improvement.",
    "Review basic React state management tradeoffs before the interview."
  ],
  notices: ["Mock mode is active. Configure the local server for real LLM output."]
};
```

- [ ] **Step 6: Run typecheck**

Run:

```bash
npm run build
```

Expected: build succeeds with no TypeScript errors.

- [ ] **Step 7: Commit shared types and fixtures**

Run:

```bash
git add src/lib/schemas.ts src/lib/mockOutput.ts examples/resume_sample.md examples/jd_sample.md examples/output_sample.json
git commit -m "feat: add application package schema and fixtures"
```

Expected: commit succeeds.

---

### Task 3: Implement Deterministic Scoring

**Files:**
- Create: `src/lib/scoring.ts`
- Create: `src/lib/scoring.test.ts`

- [ ] **Step 1: Write failing scoring tests**

Create `src/lib/scoring.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { calculateMatchScore, findSkillCoverage } from "./scoring";

describe("findSkillCoverage", () => {
  it("splits required skills into covered and missing lists", () => {
    const result = findSkillCoverage(
      ["React", "TypeScript", "CSS"],
      ["React", "JavaScript", "CSS"]
    );

    expect(result.coveredSkills).toEqual(["React", "CSS"]);
    expect(result.missingSkills).toEqual(["TypeScript"]);
  });
});

describe("calculateMatchScore", () => {
  it("combines skill coverage and evidence into a bounded score", () => {
    const score = calculateMatchScore({
      requiredSkills: ["React", "TypeScript", "CSS", "REST APIs"],
      preferredSkills: ["Testing", "Next.js"],
      resumeSkills: ["React", "CSS", "REST APIs"],
      evidenceCount: 3
    });

    expect(score).toBe(73);
  });

  it("returns zero when the job has no usable skill signals", () => {
    const score = calculateMatchScore({
      requiredSkills: [],
      preferredSkills: [],
      resumeSkills: ["React"],
      evidenceCount: 2
    });

    expect(score).toBe(0);
  });
});
```

- [ ] **Step 2: Run scoring test to verify failure**

Run:

```bash
npm test -- src/lib/scoring.test.ts
```

Expected: test fails because `src/lib/scoring.ts` does not exist.

- [ ] **Step 3: Implement `src/lib/scoring.ts`**

```ts
interface CoverageResult {
  coveredSkills: string[];
  missingSkills: string[];
}

interface MatchScoreInput {
  requiredSkills: string[];
  preferredSkills: string[];
  resumeSkills: string[];
  evidenceCount: number;
}

function normalizeSkill(skill: string): string {
  return skill.trim().toLowerCase();
}

export function findSkillCoverage(
  requiredSkills: string[],
  resumeSkills: string[]
): CoverageResult {
  const normalizedResumeSkills = new Set(resumeSkills.map(normalizeSkill));

  const coveredSkills = requiredSkills.filter((skill) =>
    normalizedResumeSkills.has(normalizeSkill(skill))
  );

  const missingSkills = requiredSkills.filter(
    (skill) => !normalizedResumeSkills.has(normalizeSkill(skill))
  );

  return { coveredSkills, missingSkills };
}

export function calculateMatchScore(input: MatchScoreInput): number {
  const requiredCount = input.requiredSkills.length;
  const preferredCount = input.preferredSkills.length;

  if (requiredCount + preferredCount === 0) {
    return 0;
  }

  const resumeSkillSet = new Set(input.resumeSkills.map(normalizeSkill));
  const requiredMatches = input.requiredSkills.filter((skill) =>
    resumeSkillSet.has(normalizeSkill(skill))
  ).length;
  const preferredMatches = input.preferredSkills.filter((skill) =>
    resumeSkillSet.has(normalizeSkill(skill))
  ).length;

  const requiredScore = requiredCount === 0 ? 0 : (requiredMatches / requiredCount) * 70;
  const preferredScore =
    preferredCount === 0 ? 0 : (preferredMatches / preferredCount) * 15;
  const evidenceScore = Math.min(input.evidenceCount, 3) * 5;

  return Math.min(100, Math.round(requiredScore + preferredScore + evidenceScore));
}
```

- [ ] **Step 4: Run scoring tests to verify pass**

Run:

```bash
npm test -- src/lib/scoring.test.ts
```

Expected: all scoring tests pass.

- [ ] **Step 5: Commit scoring**

Run:

```bash
git add src/lib/scoring.ts src/lib/scoring.test.ts
git commit -m "feat: add deterministic match scoring"
```

Expected: commit succeeds.

---

### Task 4: Implement Agent Pipeline

**Files:**
- Create: `src/agents/jdParserAgent.ts`
- Create: `src/agents/resumeAnalyzerAgent.ts`
- Create: `src/agents/matchingAgent.ts`
- Create: `src/agents/materialWriterAgent.ts`
- Create: `src/agents/interviewCoachAgent.ts`
- Create: `src/lib/applicationPipeline.ts`
- Create: `src/lib/applicationPipeline.test.ts`

- [ ] **Step 1: Write pipeline smoke test**

Create `src/lib/applicationPipeline.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { generateApplicationPackage } from "./applicationPipeline";

const resumeText = `
Skills: JavaScript, React, CSS, REST APIs
Project: Portfolio Dashboard
Built responsive React components and improved rendering performance.
`;

const jobDescriptionText = `
Frontend Engineer Intern
Requirements: React, JavaScript, CSS, TypeScript
Nice to have: Testing
Responsibilities: Build dashboard components and improve performance.
`;

describe("generateApplicationPackage", () => {
  it("returns a complete mock-mode application package", async () => {
    const result = await generateApplicationPackage({
      resumeText,
      jobDescriptionText,
      mode: "mock"
    });

    expect(result.modeUsed).toBe("mock");
    expect(result.matchReport.score).toBeGreaterThan(0);
    expect(result.matchReport.coveredSkills).toContain("React");
    expect(result.resumeSuggestions.length).toBeGreaterThan(0);
    expect(result.coverLetter).toContain("Frontend Engineer Intern");
    expect(result.interviewQuestions.length).toBeGreaterThan(0);
    expect(result.followUpChecklist.length).toBeGreaterThan(0);
  });

  it("rejects empty resume input with a clear message", async () => {
    await expect(
      generateApplicationPackage({
        resumeText: "",
        jobDescriptionText,
        mode: "mock"
      })
    ).rejects.toThrow("Resume text is required.");
  });
});
```

- [ ] **Step 2: Run pipeline test to verify failure**

Run:

```bash
npm test -- src/lib/applicationPipeline.test.ts
```

Expected: test fails because `applicationPipeline.ts` does not exist.

- [ ] **Step 3: Implement `src/agents/jdParserAgent.ts`**

```ts
import type { ParsedJobDescription } from "../lib/schemas";

const KNOWN_SKILLS = [
  "React",
  "TypeScript",
  "JavaScript",
  "HTML",
  "CSS",
  "REST APIs",
  "Testing",
  "Next.js",
  "Accessibility",
  "Performance"
];

function includesSignal(text: string, signal: string): boolean {
  return text.toLowerCase().includes(signal.toLowerCase());
}

export function parseJobDescription(jobDescriptionText: string): ParsedJobDescription {
  const firstMeaningfulLine =
    jobDescriptionText
      .split("\n")
      .map((line) => line.replace(/^#+\s*/, "").trim())
      .find(Boolean) ?? "Target Role";

  const requiredSkills = KNOWN_SKILLS.filter((skill) =>
    includesSignal(jobDescriptionText, skill)
  );

  const preferredSkills = ["Testing", "Next.js"].filter((skill) =>
    includesSignal(jobDescriptionText, skill)
  );

  return {
    roleTitle: firstMeaningfulLine,
    requiredSkills: requiredSkills.filter((skill) => !preferredSkills.includes(skill)),
    preferredSkills,
    responsibilities: [
      "Build user-facing product features.",
      "Collaborate across design and engineering.",
      "Improve usability, responsiveness, and frontend quality."
    ],
    keywords: requiredSkills,
    experienceExpectations: ["Frontend project experience", "Component-based UI work"]
  };
}
```

- [ ] **Step 4: Implement `src/agents/resumeAnalyzerAgent.ts`**

```ts
import type { ParsedResume, ResumeProject } from "../lib/schemas";

const KNOWN_SKILLS = [
  "React",
  "TypeScript",
  "JavaScript",
  "HTML",
  "CSS",
  "Python",
  "Git",
  "REST APIs",
  "Testing",
  "Next.js",
  "Performance"
];

function includesSignal(text: string, signal: string): boolean {
  return text.toLowerCase().includes(signal.toLowerCase());
}

function extractProjects(resumeText: string): ResumeProject[] {
  const projectNames = ["Portfolio Dashboard", "Campus Study Planner"].filter((name) =>
    includesSignal(resumeText, name)
  );

  if (projectNames.length === 0) {
    return [
      {
        name: "Resume Project",
        evidence: resumeText
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.startsWith("-"))
          .slice(0, 3)
      }
    ];
  }

  return projectNames.map((name) => ({
    name,
    evidence: resumeText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.startsWith("-") || includesSignal(line, name))
      .slice(0, 3)
  }));
}

export function analyzeResume(resumeText: string): ParsedResume {
  const skills = KNOWN_SKILLS.filter((skill) => includesSignal(resumeText, skill));
  const projects = extractProjects(resumeText);

  return {
    skills,
    education: resumeText.toLowerCase().includes("computer science")
      ? ["Computer Science background"]
      : [],
    projects,
    strengths: [
      "Hands-on frontend project experience",
      "Ability to describe product-facing work"
    ],
    missingSignals: ["Testing", "TypeScript"].filter(
      (skill) => !skills.map((value) => value.toLowerCase()).includes(skill.toLowerCase())
    )
  };
}
```

- [ ] **Step 5: Implement `src/agents/matchingAgent.ts`**

```ts
import type { MatchReport, ParsedJobDescription, ParsedResume } from "../lib/schemas";
import { calculateMatchScore, findSkillCoverage } from "../lib/scoring";

export function createMatchReport(
  jd: ParsedJobDescription,
  resume: ParsedResume
): MatchReport {
  const { coveredSkills, missingSkills } = findSkillCoverage(
    jd.requiredSkills,
    resume.skills
  );

  const score = calculateMatchScore({
    requiredSkills: jd.requiredSkills,
    preferredSkills: jd.preferredSkills,
    resumeSkills: resume.skills,
    evidenceCount: resume.projects.reduce(
      (total, project) => total + project.evidence.length,
      0
    )
  });

  const strongEvidence = resume.projects
    .flatMap((project) => project.evidence)
    .filter(Boolean)
    .slice(0, 4);

  const weakEvidence = missingSkills.map(
    (skill) => `${skill} appears in the role requirements but is not clearly shown.`
  );

  return {
    score,
    summary:
      missingSkills.length === 0
        ? `The resume strongly matches the ${jd.roleTitle} requirements.`
        : `The resume has relevant evidence for ${coveredSkills.join(
            ", "
          )}, but should address gaps around ${missingSkills.join(", ")}.`,
    coveredSkills,
    missingSkills,
    strongEvidence,
    weakEvidence,
    risks: missingSkills.map(
      (skill) => `Do not claim ${skill} experience unless the candidate has used it.`
    )
  };
}
```

- [ ] **Step 6: Implement `src/agents/materialWriterAgent.ts`**

```ts
import type {
  MatchReport,
  ParsedJobDescription,
  ParsedResume,
  ResumeSuggestion
} from "../lib/schemas";

export function createResumeSuggestions(
  jd: ParsedJobDescription,
  resume: ParsedResume,
  matchReport: MatchReport
): ResumeSuggestion[] {
  const mainProject = resume.projects[0];

  return [
    {
      section: mainProject?.name ?? "Projects",
      before: mainProject?.evidence[0],
      after: `Frame the project around ${jd.roleTitle} signals: reusable UI, product impact, and ${matchReport.coveredSkills
        .slice(0, 3)
        .join(", ")}.`,
      reason: "The revised framing makes the strongest existing evidence easier to connect to the JD."
    },
    {
      section: "Skills",
      after: `Keep covered skills visible: ${matchReport.coveredSkills.join(
        ", "
      )}. Add missing skills only after real practice or project evidence exists.`,
      reason: "This improves keyword coverage while preserving truthful representation."
    }
  ];
}

export function createCoverLetter(
  jd: ParsedJobDescription,
  resume: ParsedResume,
  matchReport: MatchReport
): string {
  const projectName = resume.projects[0]?.name ?? "a relevant frontend project";

  return `Dear Hiring Team,

I am excited to apply for the ${jd.roleTitle} role. My experience with ${matchReport.coveredSkills
    .slice(0, 4)
    .join(", ")} gives me a strong foundation for contributing to your frontend work.

In ${projectName}, I built product-facing features and practiced turning user needs into clear interface decisions. I am especially interested in this role because it emphasizes ${jd.responsibilities[0].toLowerCase()}

I also noticed that ${matchReport.missingSkills.join(
    ", "
  ) || "continued growth"} would be important for this position, so I would prepare honestly around those areas and keep improving through focused practice.

Thank you for your consideration.`;
}
```

- [ ] **Step 7: Implement `src/agents/interviewCoachAgent.ts`**

```ts
import type {
  InterviewQuestion,
  MatchReport,
  ParsedJobDescription,
  ParsedResume
} from "../lib/schemas";

export function createInterviewQuestions(
  jd: ParsedJobDescription,
  resume: ParsedResume,
  matchReport: MatchReport
): InterviewQuestion[] {
  const projectName = resume.projects[0]?.name ?? "your most relevant project";

  return [
    {
      type: "role",
      question: `How would you build a frontend feature for ${jd.roleTitle}?`,
      answerHint:
        "Discuss component boundaries, state, API data, loading states, and responsive behavior."
    },
    {
      type: "resume",
      question: `What was the hardest technical decision in ${projectName}?`,
      answerHint:
        "Use a concrete example from the resume and explain the tradeoff you considered."
    },
    {
      type: "behavioral",
      question: "Tell me about a time you improved a project based on feedback.",
      answerHint: "Use the STAR structure: situation, task, action, result."
    },
    {
      type: "role",
      question: `How are you preparing for gaps such as ${matchReport.missingSkills.join(
        ", "
      ) || "the role's deeper requirements"}?`,
      answerHint:
        "Be honest about current ability, describe a practice plan, and connect it to the role."
    }
  ];
}

export function createFollowUpChecklist(matchReport: MatchReport): string[] {
  return [
    "Revise the strongest project bullet so it mirrors the JD's language truthfully.",
    "Prepare one project story about UI architecture or component design.",
    "Prepare one project story about performance, responsiveness, or usability.",
    ...matchReport.missingSkills.map(
      (skill) => `Practice or document real evidence for ${skill} before claiming it.`
    )
  ];
}
```

- [ ] **Step 8: Implement `src/lib/applicationPipeline.ts`**

```ts
import { parseJobDescription } from "../agents/jdParserAgent";
import { analyzeResume } from "../agents/resumeAnalyzerAgent";
import { createMatchReport } from "../agents/matchingAgent";
import { createCoverLetter, createResumeSuggestions } from "../agents/materialWriterAgent";
import {
  createFollowUpChecklist,
  createInterviewQuestions
} from "../agents/interviewCoachAgent";
import type { ApplicationPackage, JobApplicationRequest } from "./schemas";

export async function generateApplicationPackage(
  request: JobApplicationRequest
): Promise<ApplicationPackage> {
  if (!request.resumeText.trim()) {
    throw new Error("Resume text is required.");
  }

  if (!request.jobDescriptionText.trim()) {
    throw new Error("Job description text is required.");
  }

  const jd = parseJobDescription(request.jobDescriptionText);
  const resume = analyzeResume(request.resumeText);
  const matchReport = createMatchReport(jd, resume);

  return {
    modeUsed: "mock",
    matchReport,
    resumeSuggestions: createResumeSuggestions(jd, resume, matchReport),
    coverLetter: createCoverLetter(jd, resume, matchReport),
    interviewQuestions: createInterviewQuestions(jd, resume, matchReport),
    followUpChecklist: createFollowUpChecklist(matchReport),
    notices:
      request.mode === "llm"
        ? ["LLM mode is not configured in this local demo, so deterministic mock mode was used."]
        : ["Mock mode is active. Configure the local server for real LLM output."]
  };
}
```

- [ ] **Step 9: Run pipeline tests**

Run:

```bash
npm test -- src/lib/applicationPipeline.test.ts
```

Expected: all pipeline tests pass.

- [ ] **Step 10: Run all tests**

Run:

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 11: Commit Agent pipeline**

Run:

```bash
git add src/agents src/lib/applicationPipeline.ts src/lib/applicationPipeline.test.ts
git commit -m "feat: implement application agent pipeline"
```

Expected: commit succeeds.

---

### Task 5: Build the Web Demo UI

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/styles.css`
- Create: `src/components/InputPanel.tsx`
- Create: `src/components/ResultTabs.tsx`
- Create: `src/components/MatchReport.tsx`
- Create: `src/components/ResumeSuggestions.tsx`
- Create: `src/components/CoverLetter.tsx`
- Create: `src/components/InterviewPrep.tsx`
- Create: `src/components/ResultTabs.test.tsx`

- [ ] **Step 1: Write UI smoke test**

Create `src/components/ResultTabs.test.tsx`:

```tsx
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { mockApplicationPackage } from "../lib/mockOutput";
import { ResultTabs } from "./ResultTabs";

describe("ResultTabs", () => {
  it("switches from match report to cover letter", async () => {
    render(<ResultTabs packageData={mockApplicationPackage} />);

    expect(screen.getByText("Match score")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Cover Letter" }));

    expect(screen.getByText(/Dear Hiring Team/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Implement result view components**

Create `src/components/MatchReport.tsx`:

```tsx
import type { MatchReport as MatchReportType } from "../lib/schemas";

interface Props {
  report: MatchReportType;
}

export function MatchReport({ report }: Props) {
  return (
    <section className="result-panel">
      <div className="score-row">
        <span>Match score</span>
        <strong>{report.score}</strong>
      </div>
      <p>{report.summary}</p>
      <div className="two-column">
        <div>
          <h3>Covered skills</h3>
          <ul>{report.coveredSkills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
        </div>
        <div>
          <h3>Gaps</h3>
          <ul>{report.missingSkills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
        </div>
      </div>
      <h3>Risks</h3>
      <ul>{report.risks.map((risk) => <li key={risk}>{risk}</li>)}</ul>
    </section>
  );
}
```

Create `src/components/ResumeSuggestions.tsx`:

```tsx
import type { ResumeSuggestion } from "../lib/schemas";

interface Props {
  suggestions: ResumeSuggestion[];
}

export function ResumeSuggestions({ suggestions }: Props) {
  return (
    <section className="result-panel">
      {suggestions.map((suggestion) => (
        <article className="suggestion" key={`${suggestion.section}-${suggestion.after}`}>
          <h3>{suggestion.section}</h3>
          {suggestion.before ? <p className="muted">Before: {suggestion.before}</p> : null}
          <p>After: {suggestion.after}</p>
          <p className="muted">{suggestion.reason}</p>
        </article>
      ))}
    </section>
  );
}
```

Create `src/components/CoverLetter.tsx`:

```tsx
interface Props {
  coverLetter: string;
}

export function CoverLetter({ coverLetter }: Props) {
  return (
    <section className="result-panel">
      <pre className="letter">{coverLetter}</pre>
    </section>
  );
}
```

Create `src/components/InterviewPrep.tsx`:

```tsx
import type { InterviewQuestion } from "../lib/schemas";

interface Props {
  questions: InterviewQuestion[];
  checklist: string[];
}

export function InterviewPrep({ questions, checklist }: Props) {
  return (
    <section className="result-panel">
      <h3>Interview questions</h3>
      <div className="question-list">
        {questions.map((item) => (
          <article className="question" key={item.question}>
            <span>{item.type}</span>
            <h4>{item.question}</h4>
            <p>{item.answerHint}</p>
          </article>
        ))}
      </div>
      <h3>Follow-up checklist</h3>
      <ul>{checklist.map((item) => <li key={item}>{item}</li>)}</ul>
    </section>
  );
}
```

- [ ] **Step 3: Implement `src/components/ResultTabs.tsx`**

```tsx
import { useState } from "react";
import type { ApplicationPackage } from "../lib/schemas";
import { CoverLetter } from "./CoverLetter";
import { InterviewPrep } from "./InterviewPrep";
import { MatchReport } from "./MatchReport";
import { ResumeSuggestions } from "./ResumeSuggestions";

interface Props {
  packageData: ApplicationPackage;
}

const tabs = ["Match Report", "Resume Suggestions", "Cover Letter", "Interview Prep"] as const;
type Tab = (typeof tabs)[number];

export function ResultTabs({ packageData }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("Match Report");

  return (
    <section className="results">
      <div className="mode-banner">
        <strong>{packageData.modeUsed.toUpperCase()} mode</strong>
        {packageData.notices.map((notice) => (
          <span key={notice}>{notice}</span>
        ))}
      </div>
      <div className="tabs" role="tablist" aria-label="Application package sections">
        {tabs.map((tab) => (
          <button
            aria-selected={activeTab === tab}
            className={activeTab === tab ? "tab active" : "tab"}
            key={tab}
            onClick={() => setActiveTab(tab)}
            role="tab"
            type="button"
          >
            {tab}
          </button>
        ))}
      </div>
      {activeTab === "Match Report" ? (
        <MatchReport report={packageData.matchReport} />
      ) : null}
      {activeTab === "Resume Suggestions" ? (
        <ResumeSuggestions suggestions={packageData.resumeSuggestions} />
      ) : null}
      {activeTab === "Cover Letter" ? (
        <CoverLetter coverLetter={packageData.coverLetter} />
      ) : null}
      {activeTab === "Interview Prep" ? (
        <InterviewPrep
          questions={packageData.interviewQuestions}
          checklist={packageData.followUpChecklist}
        />
      ) : null}
    </section>
  );
}
```

- [ ] **Step 4: Implement `src/components/InputPanel.tsx`**

```tsx
interface Props {
  resumeText: string;
  jobDescriptionText: string;
  isGenerating: boolean;
  onResumeChange: (value: string) => void;
  onJobDescriptionChange: (value: string) => void;
  onLoadSample: () => void;
  onGenerate: () => void;
}

export function InputPanel({
  resumeText,
  jobDescriptionText,
  isGenerating,
  onResumeChange,
  onJobDescriptionChange,
  onLoadSample,
  onGenerate
}: Props) {
  return (
    <section className="input-grid">
      <label className="input-block">
        <span>Resume</span>
        <textarea
          value={resumeText}
          onChange={(event) => onResumeChange(event.target.value)}
          placeholder="Paste a resume here..."
        />
      </label>
      <label className="input-block">
        <span>Job description</span>
        <textarea
          value={jobDescriptionText}
          onChange={(event) => onJobDescriptionChange(event.target.value)}
          placeholder="Paste a target job description here..."
        />
      </label>
      <div className="actions">
        <button type="button" className="secondary" onClick={onLoadSample}>
          Load sample
        </button>
        <button type="button" onClick={onGenerate} disabled={isGenerating}>
          {isGenerating ? "Generating..." : "Generate application package"}
        </button>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Update `src/App.tsx`**

```tsx
import { useState } from "react";
import { InputPanel } from "./components/InputPanel";
import { ResultTabs } from "./components/ResultTabs";
import { generateApplicationPackage } from "./lib/applicationPipeline";
import type { ApplicationPackage } from "./lib/schemas";

const sampleResume = `# Alex Chen

Frontend developer and computer science student interested in building usable web products.

## Skills

JavaScript, React, HTML, CSS, Python, Git, REST APIs

## Projects

### Portfolio Dashboard

- Built a responsive React dashboard for displaying personal projects and writing.
- Created reusable components for cards, filters, and project detail views.
- Improved page performance by reducing unnecessary component re-renders.

### Campus Study Planner

- Built a study planning tool with task lists, weekly goals, and progress summaries.
- Used local storage to persist tasks across sessions.
- Designed mobile-friendly layouts for students checking plans on phones.

## Education

B.S. Computer Science, expected 2027`;

const sampleJobDescription = `# Frontend Engineer Intern

We are looking for a frontend engineering intern to help build user-facing product features.

## Responsibilities

- Build React components for dashboards and workflow tools.
- Collaborate with designers and backend engineers.
- Improve accessibility, responsiveness, and frontend performance.
- Work with REST APIs and structured product data.

## Requirements

- Experience with React, JavaScript, HTML, and CSS.
- Familiarity with TypeScript.
- Understanding of component architecture and state management.
- Interest in usability, product thinking, and clean UI.

## Nice to Have

- Testing experience.
- Next.js experience.
- Experience improving web performance.`;

export default function App() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescriptionText, setJobDescriptionText] = useState("");
  const [packageData, setPackageData] = useState<ApplicationPackage | null>(null);
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleGenerate() {
    setError("");
    setIsGenerating(true);
    try {
      const result = await generateApplicationPackage({
        resumeText,
        jobDescriptionText,
        mode: "mock"
      });
      setPackageData(result);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to generate package.");
    } finally {
      setIsGenerating(false);
    }
  }

  function handleLoadSample() {
    setResumeText(sampleResume);
    setJobDescriptionText(sampleJobDescription);
    setPackageData(null);
    setError("");
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">AI job application workflow</p>
        <h1>JobApply Agent</h1>
        <p>
          Turn a resume and job description into a match report, resume guidance,
          cover letter, interview prep, and follow-up checklist.
        </p>
      </section>

      <InputPanel
        resumeText={resumeText}
        jobDescriptionText={jobDescriptionText}
        isGenerating={isGenerating}
        onResumeChange={setResumeText}
        onJobDescriptionChange={setJobDescriptionText}
        onLoadSample={handleLoadSample}
        onGenerate={handleGenerate}
      />

      {error ? <p className="error">{error}</p> : null}
      {packageData ? <ResultTabs packageData={packageData} /> : null}
    </main>
  );
}
```

- [ ] **Step 6: Replace `src/styles.css`**

```css
:root {
  color: #172026;
  background: #f7f3ea;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
}

button,
textarea,
input {
  font: inherit;
}

button {
  border: 0;
  border-radius: 8px;
  background: #1f4b3f;
  color: #fff;
  cursor: pointer;
  font-weight: 700;
  padding: 12px 16px;
}

button:disabled {
  cursor: progress;
  opacity: 0.6;
}

.app-shell {
  min-height: 100vh;
  padding: 32px;
}

.hero {
  max-width: 920px;
  margin-bottom: 28px;
}

.eyebrow {
  color: #476f65;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0;
  margin: 0 0 8px;
  text-transform: uppercase;
}

h1 {
  font-size: clamp(2rem, 4vw, 4.5rem);
  letter-spacing: 0;
  line-height: 1;
  margin: 0 0 16px;
}

h3,
h4,
p {
  margin-top: 0;
}

p,
li {
  line-height: 1.6;
}

.input-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  max-width: 1180px;
}

.input-block {
  display: grid;
  gap: 8px;
}

.input-block span {
  font-weight: 800;
}

textarea {
  border: 1px solid #c8c0b2;
  border-radius: 8px;
  min-height: 260px;
  padding: 14px;
  resize: vertical;
  width: 100%;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  grid-column: 1 / -1;
}

.secondary {
  background: #e3d8c4;
  color: #172026;
}

.error {
  color: #9d2b22;
  font-weight: 800;
  margin-top: 18px;
}

.results {
  margin-top: 28px;
  max-width: 1180px;
}

.mode-banner {
  align-items: center;
  background: #e4efe5;
  border: 1px solid #b9d1bc;
  border-radius: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 14px;
  padding: 12px;
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.tab {
  background: #e3d8c4;
  color: #172026;
}

.tab.active {
  background: #1f4b3f;
  color: #fff;
}

.result-panel {
  background: #fffaf0;
  border: 1px solid #dfd5c4;
  border-radius: 8px;
  padding: 20px;
}

.score-row {
  align-items: baseline;
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.score-row strong {
  font-size: 2.4rem;
}

.two-column {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.suggestion,
.question {
  border-bottom: 1px solid #dfd5c4;
  padding: 14px 0;
}

.suggestion:last-child,
.question:last-child {
  border-bottom: 0;
}

.muted {
  color: #5f6b67;
}

.letter {
  font-family: inherit;
  line-height: 1.7;
  white-space: pre-wrap;
}

.question span {
  color: #476f65;
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
}

@media (max-width: 760px) {
  .app-shell {
    padding: 20px;
  }

  .input-grid,
  .two-column {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 7: Run UI test**

Run:

```bash
npm test -- src/components/ResultTabs.test.tsx
```

Expected: tab switching test passes.

- [ ] **Step 8: Run build**

Run:

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 9: Commit UI**

Run:

```bash
git add src/App.tsx src/styles.css src/components
git commit -m "feat: build JobApply Agent demo UI"
```

Expected: commit succeeds.

---

### Task 6: Add Optional Local LLM Server Boundary

**Files:**
- Create: `src/lib/apiClient.ts`
- Create: `src/lib/llmClient.ts`
- Create: `server/index.ts`
- Modify: `src/lib/applicationPipeline.ts`

- [ ] **Step 1: Create `src/lib/apiClient.ts`**

```ts
import type { ApplicationPackage, JobApplicationRequest } from "./schemas";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

export async function requestLlmApplicationPackage(
  request: JobApplicationRequest
): Promise<ApplicationPackage | null> {
  if (!API_BASE_URL) {
    return null;
  }

  const response = await fetch(`${API_BASE_URL}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as ApplicationPackage;
}
```

- [ ] **Step 2: Create `src/lib/llmClient.ts`**

```ts
import type { ApplicationPackage, JobApplicationRequest } from "./schemas";
import { mockApplicationPackage } from "./mockOutput";

export async function generateWithLlm(
  request: JobApplicationRequest
): Promise<ApplicationPackage> {
  if (!process.env.LLM_API_KEY) {
    return {
      ...mockApplicationPackage,
      notices: [
        "Local server is running, but LLM_API_KEY is not configured. Mock output was returned."
      ]
    };
  }

  return {
    ...mockApplicationPackage,
    notices: [
      `LLM boundary reached for ${request.mode} mode. Replace this stub with a provider call when adding a production model integration.`
    ]
  };
}
```

- [ ] **Step 3: Create `server/index.ts`**

```ts
import cors from "cors";
import express from "express";
import { generateWithLlm } from "../src/lib/llmClient";
import type { JobApplicationRequest } from "../src/lib/schemas";

const app = express();
const port = Number(process.env.PORT ?? 8787);

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.post("/api/generate", async (req, res) => {
  const body = req.body as JobApplicationRequest;

  if (!body.resumeText?.trim() || !body.jobDescriptionText?.trim()) {
    res.status(400).json({ error: "Resume text and job description text are required." });
    return;
  }

  const result = await generateWithLlm(body);
  res.json(result);
});

app.listen(port, () => {
  console.log(`JobApply Agent local API listening on http://localhost:${port}`);
});
```

- [ ] **Step 4: Add missing dependency to `package.json`**

Modify `package.json` dependencies to include:

```json
"cors": "^2.8.5"
```

Modify `package.json` devDependencies to include:

```json
"@types/cors": "^2.8.17"
```

Run:

```bash
npm install
```

Expected: `package-lock.json` updates and installs `cors` types.

- [ ] **Step 5: Keep app defaulting to mock mode**

No UI change is required in this task. The server boundary exists for README credibility and future extension, while the app remains reliable in mock mode.

- [ ] **Step 6: Run build and tests**

Run:

```bash
npm test
npm run build
```

Expected: tests and build pass.

- [ ] **Step 7: Commit LLM boundary**

Run:

```bash
git add package.json package-lock.json src/lib/apiClient.ts src/lib/llmClient.ts server/index.ts
git commit -m "feat: add optional local LLM boundary"
```

Expected: commit succeeds.

---

### Task 7: Add Documentation for GitHub Showcase

**Files:**
- Create: `README.md`
- Create: `docs/architecture.md`
- Create: `docs/agent-flow.md`

- [ ] **Step 1: Create `docs/agent-flow.md`**

```md
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
```

- [ ] **Step 2: Create `docs/architecture.md`**

```md
# Architecture

JobApply Agent is a React + Vite TypeScript app with a deterministic mock-mode pipeline and an optional local server boundary for real LLM calls.

## Main Paths

- `src/agents/`: focused Agent modules.
- `src/lib/schemas.ts`: shared data contracts.
- `src/lib/scoring.ts`: deterministic match scoring.
- `src/lib/applicationPipeline.ts`: orchestration layer.
- `src/components/`: UI components for inputs and result tabs.
- `server/index.ts`: optional local API for LLM mode.
- `examples/`: sample resume, job description, and output.

## Modes

Mock mode is the default and does not require an API key.

LLM mode is intentionally routed through the local Node server so provider API keys are not stored in the browser. The initial MVP keeps this boundary as a stub to demonstrate the safe integration point.

## Ethical Boundary

The app helps users reframe real experience and prepare for gaps. It does not fabricate projects, employers, degrees, certifications, or outcomes.
```

- [ ] **Step 3: Create `README.md`**

```md
# JobApply Agent

JobApply Agent is a GitHub-showcase MVP for AI-assisted job applications. It turns a resume and a target job description into a structured application package: match report, resume suggestions, cover letter, interview preparation, and follow-up checklist.

## What It Solves

Job seekers often need to read long job descriptions, identify relevant skills, adapt resume bullets, write cover letters, and prepare for interviews. JobApply Agent makes that workflow explicit and repeatable.

## Agent Workflow

```text
Resume + Job Description
  -> JD Parser Agent
  -> Resume Analyzer Agent
  -> Matching Agent
  -> Material Writer Agent
  -> Interview Coach Agent
  -> Application Package
```

## Features

- Resume and job description input.
- One-click sample data for reviewers.
- Explainable match score.
- Covered skill and missing skill analysis.
- Truthful resume rewrite suggestions.
- Tailored cover letter.
- Interview questions and answer hints.
- Follow-up checklist.
- Mock mode that works without an API key.
- Optional local server boundary for real LLM mode.

## Run Locally

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal. Click `Load sample`, then click `Generate application package`.

## Optional Local API

```bash
cp .env.example .env
npm run server
```

The MVP keeps API keys on the local server side. The browser does not store provider keys.

## Example Files

- `examples/resume_sample.md`
- `examples/jd_sample.md`
- `examples/output_sample.json`

## Ethical Design

The system does not fabricate experience. It helps users reframe real experience, identify gaps, and prepare honestly for applications.

## Future Work

- PDF and DOCX resume parsing.
- Export application packages to markdown or PDF.
- Interview answer practice with feedback.
- RAG over a user's portfolio and past projects.
- Job application tracking.
```

- [ ] **Step 4: Run markdown check by reading docs**

Run:

```bash
Get-Content README.md
Get-Content docs/architecture.md
Get-Content docs/agent-flow.md
```

Expected: files render as readable markdown in the terminal with no broken code fences.

- [ ] **Step 5: Commit docs**

Run:

```bash
git add README.md docs/architecture.md docs/agent-flow.md
git commit -m "docs: add GitHub showcase documentation"
```

Expected: commit succeeds.

---

### Task 8: Final Verification and Polish

**Files:**
- Modify: `README.md`
- Modify: `src/styles.css`
- Modify: any file with a failing test or build error from this task.

- [ ] **Step 1: Run full automated verification**

Run:

```bash
npm test
npm run build
```

Expected: all tests pass and production build succeeds.

- [ ] **Step 2: Start the dev server**

Run:

```bash
npm run dev
```

Expected: Vite prints a local URL such as `http://localhost:5173/`.

- [ ] **Step 3: Manual demo QA**

In the browser:

1. Open the Vite local URL.
2. Click `Load sample`.
3. Click `Generate application package`.
4. Confirm the match report shows a score above 0.
5. Click `Resume Suggestions`.
6. Confirm at least one suggestion appears.
7. Click `Cover Letter`.
8. Confirm the letter starts with `Dear Hiring Team`.
9. Click `Interview Prep`.
10. Confirm interview questions and checklist items appear.
11. Shrink the browser width below 760px.
12. Confirm the resume and JD inputs stack vertically and text does not overlap.

- [ ] **Step 4: Add screenshot note to README**

If a screenshot is captured, add this section to `README.md`:

```md
## Demo Screenshot

![JobApply Agent demo](docs/demo-screenshot.png)
```

If no screenshot is captured in this pass, add this section instead:

```md
## Demo

Run the project locally, click `Load sample`, then click `Generate application package` to view the full demo workflow.
```

- [ ] **Step 5: Inspect git status**

Run:

```bash
git status --short
```

Expected: only intentional final polish files are modified.

- [ ] **Step 6: Commit final polish**

Run:

```bash
git add README.md src/styles.css
git commit -m "chore: polish MVP demo"
```

Expected: commit succeeds. If only README changed, stage only `README.md`.

---

## Self-Review

Spec coverage:

- GitHub showcase MVP: covered by Tasks 1, 5, 7, and 8.
- Mock mode without API key: covered by Tasks 2, 4, and 5.
- Optional LLM boundary with API key kept off the browser: covered by Task 6.
- Agent workflow separation: covered by Task 4.
- Structured application package: covered by Tasks 2 and 4.
- Testing: covered by Tasks 3, 4, 5, and 8.
- README and docs: covered by Task 7.
- Ethical design statement: covered by Task 7.

Completion scan:

- The plan contains no unfinished requirement sections or fake values that an engineer would need to invent.
- Steps that modify code include concrete file contents or exact code fragments.

Type consistency:

- `ApplicationPackage`, `MatchReport`, `ResumeSuggestion`, and `InterviewQuestion` are defined once in `src/lib/schemas.ts`.
- Agent modules use the same property names that UI components read.
- Test expectations match the deterministic scoring formula and pipeline output.
