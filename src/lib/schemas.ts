export interface JobApplicationRequest {
  resumeText: string;
  jobDescriptionText: string;
  mode: "mock" | "llm";
}

export interface ParsedJobDescription {
  roleTitle: string;
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  keywords: string[];
  experienceExpectations: string[];
}

export interface ResumeProject {
  name: string;
  evidence: string[];
}

export interface ParsedResume {
  skills: string[];
  education: string[];
  projects: ResumeProject[];
  strengths: string[];
  missingSignals: string[];
}

export interface MatchReport {
  score: number;
  summary: string;
  coveredSkills: string[];
  missingSkills: string[];
  strongEvidence: string[];
  weakEvidence: string[];
  risks: string[];
}

export interface ResumeSuggestion {
  section: string;
  before?: string;
  after: string;
  reason: string;
}

export interface InterviewQuestion {
  type: "role" | "resume" | "behavioral";
  question: string;
  answerHint: string;
}

export interface ApplicationPackage {
  modeUsed: "mock" | "llm";
  matchReport: MatchReport;
  resumeSuggestions: ResumeSuggestion[];
  coverLetter: string;
  interviewQuestions: InterviewQuestion[];
  followUpChecklist: string[];
  notices: string[];
}
