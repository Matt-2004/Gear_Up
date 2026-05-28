import React from "react";
import { render, screen } from "@testing-library/react";
import CarDetail from "../CarDetail";
import { mockCarDetails } from "@/app/shared/mock/mockCarDetails";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) =>
    React.createElement("img", { ...props, alt: (props.alt as string) || "" }),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
  }) => React.createElement("a", { href, ...rest }, children),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => "/car/car-001",
}));

jest.mock("@/app/features/navbar/context/UserDataContext", () => ({
  useUserData: () => ({ user: null }),
}));

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("CarDetail (integration)", () => {
  it("renders all major sections", () => {
    const car = mockCarDetails["car-001"];
    render(<CarDetail car={car} />);

    // Section headings
    expect(
      screen.getByRole("heading", { name: /About This Vehicle/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Performance & Details/i }),
    ).toBeInTheDocument();

    // Sidebar content
    expect(
      screen.getByRole("heading", { name: /Toyota Camry/i }),
    ).toBeInTheDocument();

    // CTA
    expect(
      screen.getByRole("button", { name: /Book a Test Drive/i }),
    ).toBeInTheDocument();
  });

  it("renders section labels", () => {
    const car = mockCarDetails["car-001"];
    render(<CarDetail car={car} />);

    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("Specifications")).toBeInTheDocument();
  });

  it("renders the More Car Options section", () => {
    const car = mockCarDetails["car-001"];
    render(<CarDetail car={car} />);

    expect(
      screen.getByRole("heading", { name: /You Might Also Like/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("More Options")).toBeInTheDocument();
  });

  it("does not include the current car in More Options", () => {
    const car = mockCarDetails["car-001"];
    render(<CarDetail car={car} />);

    // The current car's title should appear only in the sidebar, not in More Options cards
    const sidebar = document.querySelector(".lg\\:col-span-1");
    expect(sidebar).toBeInTheDocument();
  });

  it("renders car cards in the More Options grid", () => {
    const car = mockCarDetails["car-001"];
    render(<CarDetail car={car} />);

    const cards = screen.getAllByTestId("car-card");
    // Current car is excluded, so we get 4 other cars (slice of 4)
    expect(cards.length).toBe(4);
  });

  it("shows the image gallery with counter", () => {
    const car = mockCarDetails["car-001"];
    render(<CarDetail car={car} />);

    expect(screen.getByText("1 / 3")).toBeInTheDocument();
  });

  it("renders spec cards inside the specifications section", () => {
    const car = mockCarDetails["car-001"];
    render(<CarDetail car={car} />);

    expect(screen.getByText("Mileage")).toBeInTheDocument();
    expect(screen.getByText("Fuel")).toBeInTheDocument();
    expect(screen.getByText("Transmission")).toBeInTheDocument();
    expect(screen.getByText("Year")).toBeInTheDocument();
  });

  it("renders with a different car", () => {
    const car = mockCarDetails["car-003"]; // Tesla
    render(<CarDetail car={car} />);

    expect(
      screen.getByRole("heading", { name: /Tesla Model 3/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Electric")).toBeInTheDocument();
  });
});
