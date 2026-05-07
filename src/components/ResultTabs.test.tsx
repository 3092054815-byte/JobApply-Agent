import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { mockApplicationPackage } from "../lib/mockOutput";
import { ResultTabs } from "./ResultTabs";

describe("ResultTabs", () => {
  it("switches from match report to cover letter", async () => {
    render(<ResultTabs packageData={mockApplicationPackage} />);

    expect(screen.getByText("Match score")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("tab", { name: /Cover Letter/ }));

    expect(screen.getByText(/Dear Hiring Team/)).toBeInTheDocument();
  });
});
