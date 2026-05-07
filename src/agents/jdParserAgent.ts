import type { ParsedJobDescription } from "../lib/schemas";

const KNOWN_SKILLS = [
  "React",
  "TypeScript",
  "JavaScript",
  "HTML",
  "CSS",
  "REST APIs",
  "Testing",
  "Next.js",
  "Accessibility",
  "Performance"
];

const PREFERRED_SIGNALS = ["Testing", "Next.js"];

function includesSignal(text: string, signal: string): boolean {
  return text.toLowerCase().includes(signal.toLowerCase());
}

function extractBulletLines(text: string, headingSignals: string[]): string[] {
  const lines = text.split("\n");
  const bullets: string[] = [];
  let isInSection = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (headingSignals.some((signal) => includesSignal(trimmed, signal))) {
      isInSection = true;
      continue;
    }

    if (trimmed.startsWith("#") && isInSection) {
      isInSection = false;
    }

    if (isInSection && /^[-*]\s+/.test(trimmed)) {
      bullets.push(trimmed.replace(/^[-*]\s+/, ""));
    }
  }

  return bullets;
}

export function parseJobDescription(jobDescriptionText: string): ParsedJobDescription {
  const roleTitle =
    jobDescriptionText
      .split("\n")
      .map((line) => line.replace(/^#+\s*/, "").trim())
      .find(Boolean) ?? "Target Role";

  const mentionedSkills = KNOWN_SKILLS.filter((skill) =>
    includesSignal(jobDescriptionText, skill)
  );
  const preferredSkills = PREFERRED_SIGNALS.filter((skill) =>
    includesSignal(jobDescriptionText, skill)
  );
  const requiredSkills = mentionedSkills.filter((skill) => !preferredSkills.includes(skill));
  const responsibilities = extractBulletLines(jobDescriptionText, ["responsibilities"]).slice(
    0,
    5
  );

  return {
    roleTitle,
    requiredSkills,
    preferredSkills,
    responsibilities:
      responsibilities.length > 0
        ? responsibilities
        : [
            "Build user-facing product features.",
            "Collaborate across design and engineering.",
            "Improve usability, responsiveness, and frontend quality."
          ],
    keywords: mentionedSkills,
    experienceExpectations: ["Frontend project experience", "Component-based UI work"]
  };
}
