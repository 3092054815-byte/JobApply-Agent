import { mockApplicationPackage } from "./mockOutput";
import type { ApplicationPackage, JobApplicationRequest } from "./schemas";

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
    modeUsed: "mock",
    notices: [
      `LLM boundary reached for ${request.mode} mode. Replace this stub with a provider call when adding a production model integration.`
    ]
  };
}
