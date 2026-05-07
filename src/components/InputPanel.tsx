import { BriefcaseBusiness, FileText, Sparkles } from "lucide-react";

interface Props {
  resumeText: string;
  jobDescriptionText: string;
  isGenerating: boolean;
  onResumeChange: (value: string) => void;
  onJobDescriptionChange: (value: string) => void;
  onLoadSample: () => void;
  onGenerate: () => void;
}

export function InputPanel({
  resumeText,
  jobDescriptionText,
  isGenerating,
  onResumeChange,
  onJobDescriptionChange,
  onLoadSample,
  onGenerate
}: Props) {
  return (
    <section className="input-grid" aria-label="Application inputs">
      <label className="input-block">
        <span>
          <FileText aria-hidden="true" size={18} />
          Resume
        </span>
        <textarea
          value={resumeText}
          onChange={(event) => onResumeChange(event.target.value)}
          placeholder="Paste a resume here..."
        />
      </label>
      <label className="input-block">
        <span>
          <BriefcaseBusiness aria-hidden="true" size={18} />
          Job description
        </span>
        <textarea
          value={jobDescriptionText}
          onChange={(event) => onJobDescriptionChange(event.target.value)}
          placeholder="Paste a target job description here..."
        />
      </label>
      <div className="actions">
        <button type="button" className="secondary" onClick={onLoadSample}>
          <FileText aria-hidden="true" size={18} />
          Load sample
        </button>
        <button type="button" onClick={onGenerate} disabled={isGenerating}>
          <Sparkles aria-hidden="true" size={18} />
          {isGenerating ? "Generating..." : "Generate package"}
        </button>
      </div>
    </section>
  );
}
