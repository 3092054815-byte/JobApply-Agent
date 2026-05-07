interface Props {
  coverLetter: string;
}

export function CoverLetter({ coverLetter }: Props) {
  return (
    <section className="result-panel">
      <pre className="letter">{coverLetter}</pre>
    </section>
  );
}
