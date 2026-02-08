import { render, screen } from "@testing-library/react";
import StatsCard from "./StatsCard";

describe("StatsCard", () => {
  it("renders with default variant", () => {
    render(<StatsCard label="Total Cars" value={10} />);

    expect(screen.getByText("Total Cars")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("renders with yellow variant", () => {
    const { container } = render(
      <StatsCard label="Pending Review" value={5} variant="yellow" />,
    );

    expect(screen.getByText("Pending Review")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("border-yellow-200");
  });

  it("renders with green variant", () => {
    const { container } = render(
      <StatsCard label="Approved" value={15} variant="green" />,
    );

    expect(screen.getByText("Approved")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("border-green-200");
  });

  it("renders with red variant", () => {
    const { container } = render(
      <StatsCard label="Rejected" value={3} variant="red" />,
    );

    expect(screen.getByText("Rejected")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("border-red-200");
  });

  it("renders TrendingUp icon on hover", () => {
    const { container } = render(<StatsCard label="Total Cars" value={10} />);

    const iconContainer = container.querySelector(".opacity-0");
    expect(iconContainer).toBeInTheDocument();
  });

  it("displays zero value correctly", () => {
    render(<StatsCard label="No Cars" value={0} />);

    expect(screen.getByText("No Cars")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("displays large numbers correctly", () => {
    render(<StatsCard label="Many Cars" value={9999} />);

    expect(screen.getByText("Many Cars")).toBeInTheDocument();
    expect(screen.getByText("9999")).toBeInTheDocument();
  });
});
