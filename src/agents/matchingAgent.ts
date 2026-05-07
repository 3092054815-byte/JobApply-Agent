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
  const evidenceCount = resume.projects.reduce(
    (total, project) => total + project.evidence.length,
    0
  );
  const score = calculateMatchScore({
    requiredSkills: jd.requiredSkills,
    preferredSkills: jd.preferredSkills,
    resumeSkills: resume.skills,
    evidenceCount
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
