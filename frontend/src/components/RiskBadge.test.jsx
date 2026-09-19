import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import RiskBadge from "./RiskBadge";

describe("RiskBadge", () => {
  it("renders the model class without inventing a risk label", () => {
    render(<RiskBadge prediction={1} />);
    expect(screen.getByText("Model class 1")).toBeInTheDocument();
    expect(screen.queryByText(/high|low|safe/i)).not.toBeInTheDocument();
  });
});