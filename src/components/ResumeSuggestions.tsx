import { PenLine } from "lucide-react";
import type { ResumeSuggestion } from "../lib/schemas";

interface Props {
  suggestions: ResumeSuggestion[];
}

export function ResumeSuggestions({ suggestions }: Props) {
  return (
    <section className="result-panel">
      {suggestions.map((suggestion) => (
        <article className="suggestion" key={`${suggestion.section}-${suggestion.after}`}>
          <h3>
            <PenLine aria-hidden="true" size={18} />
            {suggestion.section}
          </h3>
          {suggestion.before ? <p className="muted">Before: {suggestion.before}</p> : null}
          <p>After: {suggestion.after}</p>
          <p className="muted">{suggestion.reason}</p>
        </article>
      ))}
    </section>
  );
}
