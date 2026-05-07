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
