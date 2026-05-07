import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { MatchReport as MatchReportType } from "../lib/schemas";

interface Props {
  report: MatchReportType;
}

export function MatchReport({ report }: Props) {
  return (
    <section className="result-panel">
      <div className="score-row">
        <span>Match score</span>
        <strong>{report.score}</strong>
      </div>
      <p className="summary">{report.summary}</p>
      <div className="two-column">
        <div className="signal-block">
          <h3>
            <CheckCircle2 aria-hidden="true" size={18} />
            Covered skills
          </h3>
          <ul>{report.coveredSkills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
        </div>
        <div className="signal-block">
          <h3>
            <AlertTriangle aria-hidden="true" size={18} />
            Gaps
          </h3>
          <ul>{report.missingSkills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
        </div>
      </div>
      <h3>Evidence</h3>
      <ul>{report.strongEvidence.map((item) => <li key={item}>{item}</li>)}</ul>
      <h3>Risk notes</h3>
      <ul>{report.risks.map((risk) => <li key={risk}>{risk}</li>)}</ul>
    </section>
  );
}
