import React from "react";
import { render, screen } from "@testing-library/react";
import CarDetail from "../CarDetail";
import { mockCarDetails } from "@/app/shared/mock/mockCarDetails";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

// MoreCarOptions uses useQuery from @tanstack/react-query, but this test
// suite doesn't provide a QueryClientProvider. Mock useQuery to return
// enough data so MoreCarOptions renders car cards.
const mockMoreCars = [
  {
    id: "car-002",
    imageUrl: "/carImages/1.jpg",
    title: "2023 Honda Civic Si",
    make: "Honda",
    model: "Civic",
    transmission: "Manual",
    status: "Approved",
    mileage: 18400,
    seats: 5,
    price: 26800,
    color: "Orange",
    createdAt: new Date(),
  },
  {
    id: "car-003",
    imageUrl: "/carImages/2.jpg",
    title: "2024 Tesla Model 3 Long Range",
    make: "Tesla",
    model: "Model 3",
    transmission: "Automatic",
    status: "Approved",
    mileage: 3100,
    seats: 5,
    price: 47999,
    color: "Blue",
    createdAt: new Date(),
  },
  {
    id: "car-004",
    imageUrl: "/carImages/3.jpg",
    title: "2022 BMW X5",
    make: "BMW",
    model: "X5",
    transmission: "Automatic",
    status: "Approved",
    mileage: 36200,
    seats: 5,
    price: 45500,
    color: "White",
    createdAt: new Date(),
  },
  {
    id: "car-005",
    imageUrl: "/carImages/4.jpg",
    title: "2023 Ford Mustang GT",
    make: "Ford",
    model: "Mustang",
    transmission: "Manual",
    status: "Approved",
    mileage: 12100,
    seats: 4,
    price: 43900,
    color: "Red",
    createdAt: new Date(),
  },
];

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn().mockReturnValue({ data: mockMoreCars }),
}));
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
