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
  const skillPhrase = matchReport.coveredSkills.slice(0, 3).join(", ");

  return [
    {
      section: mainProject?.name ?? "Projects",
      before: mainProject?.evidence[0],
      after: `Frame the project around ${jd.roleTitle} signals: reusable UI, product impact, and ${skillPhrase}.`,
      reason:
        "The revised framing makes the strongest existing evidence easier to connect to the JD."
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
  const coveredSkills = matchReport.coveredSkills.slice(0, 4).join(", ");
  const growthAreas =
    matchReport.missingSkills.length > 0
      ? matchReport.missingSkills.join(", ")
      : "the role's deeper requirements";

  return `Dear Hiring Team,

I am excited to apply for the ${jd.roleTitle} role. My experience with ${coveredSkills} gives me a strong foundation for contributing to your frontend work.

In ${projectName}, I built product-facing features and practiced turning user needs into clear interface decisions. I am especially interested in this role because it emphasizes ${jd.responsibilities[0].toLowerCase()}

I also noticed that ${growthAreas} would be important for this position, so I would prepare honestly around those areas and keep improving through focused practice.

Thank you for your consideration.`;
}
