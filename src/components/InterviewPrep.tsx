import { ListChecks, MessagesSquare } from "lucide-react";
import type { InterviewQuestion } from "../lib/schemas";

interface Props {
  questions: InterviewQuestion[];
  checklist: string[];
}

export function InterviewPrep({ questions, checklist }: Props) {
  return (
    <section className="result-panel">
      <h3>
        <MessagesSquare aria-hidden="true" size={18} />
        Interview questions
      </h3>
      <div className="question-list">
        {questions.map((item) => (
          <article className="question" key={item.question}>
            <span>{item.type}</span>
            <h4>{item.question}</h4>
            <p>{item.answerHint}</p>
          </article>
        ))}
      </div>
      <h3>
        <ListChecks aria-hidden="true" size={18} />
        Follow-up checklist
      </h3>
      <ul>{checklist.map((item) => <li key={item}>{item}</li>)}</ul>
    </section>
  );
}
