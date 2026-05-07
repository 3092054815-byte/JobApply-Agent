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

    expect(score).toBe(68);
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
