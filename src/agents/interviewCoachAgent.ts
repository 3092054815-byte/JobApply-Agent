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
  const gaps =
    matchReport.missingSkills.length > 0
      ? matchReport.missingSkills.join(", ")
      : "the role's deeper requirements";

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
      question: `How are you preparing for gaps such as ${gaps}?`,
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
