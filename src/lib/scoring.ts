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
