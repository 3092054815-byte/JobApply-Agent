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
