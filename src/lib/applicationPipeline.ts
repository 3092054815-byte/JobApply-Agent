import { createInterviewQuestions, createFollowUpChecklist } from "../agents/interviewCoachAgent";
import { parseJobDescription } from "../agents/jdParserAgent";
import { createMatchReport } from "../agents/matchingAgent";
import { createCoverLetter, createResumeSuggestions } from "../agents/materialWriterAgent";
import { analyzeResume } from "../agents/resumeAnalyzerAgent";
import { requestLlmApplicationPackage } from "./apiClient";
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

  if (request.mode === "llm") {
    const llmResult = await requestLlmApplicationPackage(request);

    if (llmResult) {
      return llmResult;
    }
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
