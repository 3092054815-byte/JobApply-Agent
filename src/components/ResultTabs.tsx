import { FileText, ListChecks, PenLine, Target } from "lucide-react";
import { useState } from "react";
import type { ApplicationPackage } from "../lib/schemas";
import { CoverLetter } from "./CoverLetter";
import { InterviewPrep } from "./InterviewPrep";
import { MatchReport } from "./MatchReport";
import { ResumeSuggestions } from "./ResumeSuggestions";

interface Props {
  packageData: ApplicationPackage;
}

const tabs = ["Match Report", "Resume Suggestions", "Cover Letter", "Interview Prep"] as const;
type Tab = (typeof tabs)[number];

const tabIcons = {
  "Match Report": Target,
  "Resume Suggestions": PenLine,
  "Cover Letter": FileText,
  "Interview Prep": ListChecks
};

export function ResultTabs({ packageData }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("Match Report");

  return (
    <section className="results">
      <div className="mode-banner">
        <strong>{packageData.modeUsed.toUpperCase()} mode</strong>
        {packageData.notices.map((notice) => (
          <span key={notice}>{notice}</span>
        ))}
      </div>
      <div className="tabs" role="tablist" aria-label="Application package sections">
        {tabs.map((tab) => {
          const Icon = tabIcons[tab];
          return (
            <button
              aria-selected={activeTab === tab}
              className={activeTab === tab ? "tab active" : "tab"}
              key={tab}
              onClick={() => setActiveTab(tab)}
              role="tab"
              type="button"
            >
              <Icon aria-hidden="true" size={17} />
              {tab}
            </button>
          );
        })}
      </div>
      {activeTab === "Match Report" ? (
        <MatchReport report={packageData.matchReport} />
      ) : null}
      {activeTab === "Resume Suggestions" ? (
        <ResumeSuggestions suggestions={packageData.resumeSuggestions} />
      ) : null}
      {activeTab === "Cover Letter" ? (
        <CoverLetter coverLetter={packageData.coverLetter} />
      ) : null}
      {activeTab === "Interview Prep" ? (
        <InterviewPrep
          questions={packageData.interviewQuestions}
          checklist={packageData.followUpChecklist}
        />
      ) : null}
    </section>
  );
}
