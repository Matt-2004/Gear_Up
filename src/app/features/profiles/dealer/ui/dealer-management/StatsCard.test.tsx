import { render, screen } from "@testing-library/react";
import StatsCard from "./StatsCard";

describe("StatsCard", () => {
  it("renders with default variant", () => {
    render(
      <StatsCard label="Total Cars" value={10} description="All vehicles" />,
    );

    expect(screen.getByText("Total Cars")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("renders with yellow variant", () => {
    render(
      <StatsCard
        label="Pending Review"
        value={5}
        description="Awaiting approval"
        variant="yellow"
      />,
    );

    expect(screen.getByText("Pending Review")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByTestId("stat-card")).toBeInTheDocument();
  });

  it("renders with green variant", () => {
    render(
      <StatsCard
        label="Approved"
        value={15}
        description="Approved listings"
        variant="green"
      />,
    );

    expect(screen.getByText("Approved")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByTestId("stat-card")).toBeInTheDocument();
  });

  it("renders with red variant", () => {
    render(
      <StatsCard
        label="Rejected"
        value={3}
        description="Requires action"
        variant="red"
      />,
    );

    expect(screen.getByText("Rejected")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByTestId("stat-card")).toBeInTheDocument();
  });

  it("displays zero value correctly", () => {
    render(<StatsCard label="No Cars" value={0} description="None" />);

    expect(screen.getByText("No Cars")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("displays large numbers correctly", () => {
    render(
      <StatsCard label="Many Cars" value={9999} description="Large count" />,
    );

    expect(screen.getByText("Many Cars")).toBeInTheDocument();
    expect(screen.getByText("9,999")).toBeInTheDocument();
  });
});
