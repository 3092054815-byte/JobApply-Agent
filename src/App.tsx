import { useState } from "react";
import sampleJobDescription from "../examples/jd_sample.md?raw";
import sampleResume from "../examples/resume_sample.md?raw";
import { InputPanel } from "./components/InputPanel";
import { ResultTabs } from "./components/ResultTabs";
import { generateApplicationPackage } from "./lib/applicationPipeline";
import type { ApplicationPackage } from "./lib/schemas";

export default function App() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescriptionText, setJobDescriptionText] = useState("");
  const [packageData, setPackageData] = useState<ApplicationPackage | null>(null);
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleGenerate() {
    setError("");
    setIsGenerating(true);
    try {
      const result = await generateApplicationPackage({
        resumeText,
        jobDescriptionText,
        mode: "mock"
      });
      setPackageData(result);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to generate package.");
    } finally {
      setIsGenerating(false);
    }
  }

  function handleLoadSample() {
    setResumeText(sampleResume);
    setJobDescriptionText(sampleJobDescription);
    setPackageData(null);
    setError("");
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">Agent application dossier</p>
        <h1>JobApply Agent</h1>
        <p>
          Turn a resume and job description into a match report, resume guidance,
          cover letter, interview prep, and follow-up checklist.
        </p>
      </section>

      <InputPanel
        resumeText={resumeText}
        jobDescriptionText={jobDescriptionText}
        isGenerating={isGenerating}
        onResumeChange={setResumeText}
        onJobDescriptionChange={setJobDescriptionText}
        onLoadSample={handleLoadSample}
        onGenerate={handleGenerate}
      />

      {error ? <p className="error">{error}</p> : null}
      {packageData ? <ResultTabs packageData={packageData} /> : null}
    </main>
  );
}
