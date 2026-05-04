import { render, screen } from "@testing-library/react";
import DashboardHeader from "./DashboardHeader";

// Mock Next.js Link component
jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe("DashboardHeader", () => {
  it("renders the header title", () => {
    render(<DashboardHeader />);

    expect(screen.getByText("Vehicle Inventory")).toBeInTheDocument();
  });

  it("renders the subtitle description", () => {
    render(<DashboardHeader />);

    expect(
      screen.getByText(
        "Manage your inventory, sales, and performance all in one place.",
      ),
    ).toBeInTheDocument();
  });

  it("renders Add Vehicle button", () => {
    render(<DashboardHeader />);

    expect(
      screen.getByRole("button", { name: /add vehicle/i }),
    ).toBeInTheDocument();
  });

  it("has correct link to add car page", () => {
    render(<DashboardHeader />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/profile/dealer/cars/add?step=1");
  });

  it("renders Car icon", () => {
    const { container } = render(<DashboardHeader />);

    // Check for icon container with gradient background
    const iconContainer = container.querySelector(".bg-gradient-to-br");
    expect(iconContainer).toBeInTheDocument();
  });

  it("renders Plus icon in button", () => {
    render(<DashboardHeader />);

    const button = screen.getByRole("button", { name: /add vehicle/i });
    expect(button).toBeInTheDocument();
  });

  it("applies responsive layout classes", () => {
    const { container } = render(<DashboardHeader />);

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("flex-col", "sm:flex-row");
  });
});
