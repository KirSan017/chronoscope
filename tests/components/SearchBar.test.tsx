import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SearchBar } from "@/components/Search/SearchBar";
import type { HistoryEvent } from "@/types";

const events: HistoryEvent[] = [
  { id: "Q1", title: "Пушкин", dateStart: "1799-06-06", dateEnd: "1837-02-10", category: "person", wikiUrl: "https://ru.wikipedia.org/wiki/Пушкин" },
  { id: "Q2", title: "Наполеон", dateStart: "1769-08-15", dateEnd: "1821-05-05", category: "person", wikiUrl: "https://ru.wikipedia.org/wiki/Наполеон" },
];

describe("SearchBar", () => {
  it("renders input with placeholder", () => {
    render(<SearchBar events={events} onSelect={() => {}} />);
    expect(screen.getByPlaceholderText(/Пушкин/)).toBeInTheDocument();
  });
  it("shows matching results on input", () => {
    render(<SearchBar events={events} onSelect={() => {}} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Пуш" } });
    expect(screen.getByText("Пушкин")).toBeInTheDocument();
  });
  it("calls onSelect with matching event", () => {
    const onSelect = vi.fn();
    render(<SearchBar events={events} onSelect={onSelect} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Пуш" } });
    fireEvent.click(screen.getByText("Пушкин"));
    expect(onSelect).toHaveBeenCalledWith(events[0]);
  });
});
