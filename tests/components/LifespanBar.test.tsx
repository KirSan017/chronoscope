import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LifespanBar } from "@/components/Timeline/LifespanBar";
import type { HistoryEvent } from "@/types";

const person: HistoryEvent = {
  id: "Q7200", title: "А.С. Пушкин",
  dateStart: "1799-06-06", dateEnd: "1837-02-10",
  category: "person", wikiUrl: "https://ru.wikipedia.org/wiki/Пушкин",
};

describe("LifespanBar", () => {
  it("renders person name and years", () => {
    render(<LifespanBar person={person} left={100} width={300} top={50} onClick={() => {}} />);
    expect(screen.getByText("А.С. Пушкин")).toBeInTheDocument();
    expect(screen.getByText("1799 — 1837")).toBeInTheDocument();
  });
});
