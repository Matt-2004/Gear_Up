import { render, screen } from "@testing-library/react";
import EmptyInventoryState from "./EmptyInventoryState";

// Mock Next.js Link component
jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe("EmptyInventoryState", () => {
  it("renders the main heading", () => {
    render(<EmptyInventoryState />);

    expect(
      screen.getByText("No vehicles in inventory yet"),
    ).toBeInTheDocument();
  });

  it("renders the description text", () => {
    render(<EmptyInventoryState />);

    expect(
      screen.getByText(
        "Start building your inventory today and reach thousands of potential buyers.",
      ),
    ).toBeInTheDocument();
  });

  it("renders Add Your First Vehicle button", () => {
    render(<EmptyInventoryState />);

    expect(
      screen.getByRole("button", { name: /add your first vehicle/i }),
    ).toBeInTheDocument();
  });

  it("has correct link to add car page", () => {
    render(<EmptyInventoryState />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/profile/dealer/cars/add?step=1");
  });

  it("renders all three feature cards", () => {
    render(<EmptyInventoryState />);

    expect(screen.getByText("Easy Listing")).toBeInTheDocument();
    expect(screen.getByText("Reach More Buyers")).toBeInTheDocument();
    expect(screen.getByText("Track Performance")).toBeInTheDocument();
  });

  it("renders feature descriptions", () => {
    render(<EmptyInventoryState />);

    expect(
      screen.getByText("Quick and simple vehicle management"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Connect with verified customers"),
    ).toBeInTheDocument();
    expect(screen.getByText("Monitor views and inquiries")).toBeInTheDocument();
  });

  it("renders CarFront icon", () => {
    const { container } = render(<EmptyInventoryState />);

    // Check for icon container with gradient background
    const iconContainer = container.querySelector(".bg-linear-to-br");
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
    expect(featureGrid).toHaveClass("grid-cols-1", "md:grid-cols-3");
  });
});
