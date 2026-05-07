import type { ParsedResume, ResumeProject } from "../lib/schemas";

const KNOWN_SKILLS = [
  "React",
  "TypeScript",
  "JavaScript",
  "HTML",
  "CSS",
  "Python",
  "Git",
  "REST APIs",
  "Testing",
  "Next.js",
  "Performance"
];

function includesSignal(text: string, signal: string): boolean {
  return text.toLowerCase().includes(signal.toLowerCase());
}

function extractProjectNames(resumeText: string): string[] {
  return resumeText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("### "))
    .map((line) => line.replace(/^###\s+/, ""));
}

function extractEvidenceLines(resumeText: string): string[] {
  return resumeText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^[-*]\s+/.test(line))
    .map((line) => line.replace(/^[-*]\s+/, ""));
}

function extractProjects(resumeText: string): ResumeProject[] {
  const projectNames = extractProjectNames(resumeText);
  const evidence = extractEvidenceLines(resumeText);

  if (projectNames.length === 0) {
    return [
      {
        name: "Resume Project",
        evidence: evidence.slice(0, 3)
      }
    ];
  }

  return projectNames.map((name, index) => ({
    name,
    evidence: evidence.slice(index * 3, index * 3 + 3)
  }));
}

export function analyzeResume(resumeText: string): ParsedResume {
  const skills = KNOWN_SKILLS.filter((skill) => includesSignal(resumeText, skill));
  const projects = extractProjects(resumeText);
  const normalizedSkills = skills.map((value) => value.toLowerCase());

  return {
    skills,
    education: resumeText.toLowerCase().includes("computer science")
      ? ["Computer Science background"]
      : [],
    projects,
    strengths: [
      "Hands-on frontend project experience",
      "Ability to describe product-facing work"
    ],
    missingSignals: ["Testing", "TypeScript"].filter(
      (skill) => !normalizedSkills.includes(skill.toLowerCase())
    )
  };
}
