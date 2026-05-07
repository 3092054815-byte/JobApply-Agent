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

## Data Flow

```text
InputPanel
  -> generateApplicationPackage()
  -> parseJobDescription()
  -> analyzeResume()
  -> createMatchReport()
  -> createResumeSuggestions() + createCoverLetter()
  -> createInterviewQuestions() + createFollowUpChecklist()
  -> ResultTabs
```

## Testing Strategy

- `src/lib/scoring.test.ts` verifies deterministic skill coverage and score behavior.
- `src/lib/applicationPipeline.test.ts` verifies the application package flow.
- `src/components/ResultTabs.test.tsx` verifies the primary tab interaction.

## Ethical Boundary

The app helps users reframe real experience and prepare for gaps. It does not fabricate projects, employers, degrees, certifications, or outcomes.
