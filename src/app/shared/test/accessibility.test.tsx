import React from "react";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import EmptyInventoryState from "@/app/features/profiles/dealer/ui/dealer-management/EmptyInventoryState";
import DashboardHeader from "@/app/features/profiles/dealer/ui/dealer-management/DashboardHeader";
import StatsCard from "@/app/features/profiles/dealer/ui/dealer-management/StatsCard";
import SellMyCarCTA from "@/app/features/home/ui/SellMyCarCTA";
import CarList from "@/app/features/profiles/dealer/ui/dealer-management/CarList";
import { CarModel } from "@/app/features/car/types/car.model";
import HeroSection from "@/app/features/home/ui/HeroSection";
import ValuePropositionSection from "@/app/features/home/ui/ValuePropositionSection";
import FilterDropdown from "@/app/features/profiles/dealer/ui/dealer-management/FilterDropdown";
import { CarStatus } from "@/app/features/car/types/car.dto";

jest.mock("next/link", () => {
  function LinkMock({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  return {
    __esModule: true,
    default: LinkMock,
  };
});

jest.mock("next/image", () => {
  function ImageMock({
    fill: _fill,
    priority: _priority,
    ...props
  }: React.ComponentProps<"img"> & {
    fill?: boolean;
    priority?: boolean;
  }) {
    return <img {...props} />;
  }

  return {
    __esModule: true,
    default: ImageMock,
  };
});

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

jest.mock("@/app/features/navbar/context/UserDataContext", () => ({
  useUserData: () => ({
    user: null,
  }),
}));

jest.mock(
  "@/app/features/profiles/dealer/ui/dealer-management/DealerCarCard",
  () => ({
    __esModule: true,
    default: ({ car }: { car: CarModel }) => (
      <div data-testid="dealer-car-card">{car.title}</div>
    ),
  }),
);

jest.mock(
  "@/app/features/profiles/dealer/ui/dealer-management/CarTable",
  () => ({
    __esModule: true,
    default: ({ cars }: { cars: CarModel[] }) => (
      <div data-testid="car-table">{cars.length}</div>
    ),
  }),
);

describe("Accessibility", () => {
  it("EmptyInventoryState has no a11y violations", async () => {
    const { container } = render(<EmptyInventoryState />);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });

  it("DashboardHeader has no a11y violations", async () => {
    const { container } = render(<DashboardHeader />);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });

  it("StatsCard has no a11y violations", async () => {
    const { container } = render(
      <StatsCard
        label="All Listings"
        value={12}
        description="All listings across every status"
      />,
    );
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });

  it("SellMyCarCTA has no a11y violations", async () => {
    const { container } = render(<SellMyCarCTA />);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });

  it("CarList has no a11y violations", async () => {
    const cars: CarModel[] = [
      {
        id: "1",
        title: "Tesla Model 3",
        make: "Tesla",
        model: "Model 3",
        transmission: "Automatic",
        status: "Approved",
        mileage: 15000,
        seats: 5,
        price: 45000,
        color: "Red",
        imageUrl: "https://example.com/tesla.jpg",
        createdAt: new Date(),
      },
    ];

    const { container } = render(
      <CarList cars={cars} onDelete={jest.fn()} onEdit={jest.fn()} />,
    );
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });

  it("HeroSection has no a11y violations", async () => {
    const { container } = render(<HeroSection />);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });

  it("ValuePropositionSection has no a11y violations", async () => {
    const { container } = render(<ValuePropositionSection />);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });

  it("FilterDropdown has no a11y violations", async () => {
    const { container } = render(
      <FilterDropdown
        filter={"All" as CarStatus | "All"}
        dropdownOpen={true}
        carCounts={{ total: 10, pending: 2, approved: 6, rejected: 2 }}
        onToggleDropdown={jest.fn()}
        onFilterChange={jest.fn()}
      />,
    );
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
