import { render, screen } from "@testing-library/react";
import ValuePropositionSection from "./ValuePropositionSection";

describe("ValuePropositionSection", () => {
  it("renders section heading and subheading", () => {
    render(<ValuePropositionSection />);

    expect(
      screen.getByRole("heading", { name: /built for trust, speed, and ease/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /everything you need to find, book, and buy your next car/i,
      ),
    ).toBeInTheDocument();
  });

  it("renders all value proposition cards", () => {
    render(<ValuePropositionSection />);

    expect(screen.getByText(/verified listings/i)).toBeInTheDocument();
    expect(screen.getByText(/secure transactions/i)).toBeInTheDocument();
    expect(screen.getByText(/instant booking/i)).toBeInTheDocument();
    expect(screen.getByText(/financing support/i)).toBeInTheDocument();
  });
});
