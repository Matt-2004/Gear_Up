import { render, screen } from "@testing-library/react";
import ValuePropositionSection from "./ValuePropositionSection";

describe("ValuePropositionSection", () => {
  it("renders section heading and subheading", () => {
    render(<ValuePropositionSection />);

    expect(screen.getByRole("heading", { name: /why choose gearup/i })).toBeInTheDocument();
    expect(
      screen.getByText(/built to help buyers and sellers move faster with confidence/i),
    ).toBeInTheDocument();
  });

  it("renders all value proposition cards", () => {
    render(<ValuePropositionSection />);

    expect(screen.getByText(/trust/i)).toBeInTheDocument();
    expect(screen.getByText(/real-time market insight/i)).toBeInTheDocument();
    expect(screen.getByText(/secure & verified listings/i)).toBeInTheDocument();
    expect(screen.getByText(/instance booking system/i)).toBeInTheDocument();
  });
});
