import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CategoryFilters } from "@/components/Filters/CategoryFilters";
import type { Category } from "@/types";

describe("CategoryFilters", () => {
  const allCategories: Category[] = ["politics", "science", "culture", "religion", "technology", "person"];

  it("renders all category buttons", () => {
    render(<CategoryFilters active={new Set(allCategories)} onToggle={() => {}} />);
    expect(screen.getByText("Политика")).toBeInTheDocument();
    expect(screen.getByText("Наука")).toBeInTheDocument();
    expect(screen.getByText("Культура")).toBeInTheDocument();
    expect(screen.getByText("Люди")).toBeInTheDocument();
  });
  it("calls onToggle when clicked", () => {
    const onToggle = vi.fn();
    render(<CategoryFilters active={new Set(allCategories)} onToggle={onToggle} />);
    fireEvent.click(screen.getByText("Наука"));
    expect(onToggle).toHaveBeenCalledWith("science");
  });
});
