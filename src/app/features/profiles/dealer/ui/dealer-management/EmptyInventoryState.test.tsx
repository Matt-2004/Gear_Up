import { render, screen } from "@testing-library/react";
import EmptyInventoryState from "./EmptyInventoryState";

// Mock Next.js Link component
jest.mock("next/link", () => {
  function LinkMock({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) {
    return <a href={href}>{children}</a>;
  }

  return LinkMock;
});

describe("EmptyInventoryState", () => {
  it("renders the main heading", () => {
    render(<EmptyInventoryState />);

    expect(screen.getByText("No vehicles yet")).toBeInTheDocument();
  });

  it("renders the description text", () => {
    render(<EmptyInventoryState />);

    expect(
      screen.getByText(
        "Add your first listing to start receiving inquiries and appointments.",
      ),
    ).toBeInTheDocument();
  });

  it("renders Add Your First Vehicle button", () => {
    render(<EmptyInventoryState />);

    expect(
      screen.getByRole("button", { name: /add first vehicle/i }),
    ).toBeInTheDocument();
  });

  it("has correct link to add car page", () => {
    render(<EmptyInventoryState />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/profile/dealer/cars/add?step=1");
  });

  it("renders all three feature cards", () => {
    render(<EmptyInventoryState />);

    expect(screen.getByText("Fast Listing")).toBeInTheDocument();
    expect(screen.getByText("Reach Buyers")).toBeInTheDocument();
    expect(screen.getByText("Track Performance")).toBeInTheDocument();
  });

  it("renders feature descriptions", () => {
    render(<EmptyInventoryState />);

    expect(
      screen.getByText("Upload photos and details in minutes"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Get in front of ready customers"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Monitor views, saves, and inquiries"),
    ).toBeInTheDocument();
  });

  it("renders CarFront icon", () => {
    const { container } = render(<EmptyInventoryState />);

    const iconContainer = container.querySelector(".border-dashed");
    expect(iconContainer).toBeInTheDocument();
  });

  it("renders Plus icon in button", () => {
    render(<EmptyInventoryState />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("renders feature icons", () => {
    const { container } = render(<EmptyInventoryState />);

    // Check for multiple SVG icons
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThan(3); // At least 4 icons (main + 3 features)
  });

  it("applies animation classes", () => {
    const { container } = render(<EmptyInventoryState />);

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("animate-in", "fade-in");
  });

  it("renders with responsive grid layout", () => {
    const { container } = render(<EmptyInventoryState />);

    const featureGrid = container.querySelector(".grid");
    expect(featureGrid).toHaveClass("grid-cols-1", "sm:grid-cols-3");
  });
});
