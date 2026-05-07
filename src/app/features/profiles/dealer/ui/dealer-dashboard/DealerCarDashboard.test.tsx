import { render, screen } from "@testing-library/react";
import DealerCarDashboard from "./DealerCarDashboard";
import { CarModel } from "@/app/features/car/types/car.model";

// Mock child components
jest.mock("../dealer-management/CarList", () => ({
  __esModule: true,
  default: ({ cars }: { cars: CarModel[] }) => (
    <div data-testid="car-list">Cars: {cars.length}</div>
  ),
}));

jest.mock("../dealer-management/ConditionalCarFilter", () => ({
  __esModule: true,
  default: () => <div data-testid="conditional-filter">Filters</div>,
}));

jest.mock("../dealer-management/DashboardHeader", () => ({
  __esModule: true,
  default: () => <div data-testid="dashboard-header">Header</div>,
}));

jest.mock("../dealer-management/StatsCard", () => ({
  __esModule: true,
  default: ({ label, value }: { label: string; value: number }) => (
    <div data-testid="stats-card">
      {label}: {value}
    </div>
  ),
}));

// Mock hooks
jest.mock("../../hooks/useCarFilters", () => ({
  useCarFilters: () => ({
    isFilterOpen: false,
    statusFilter: "All",
    toggleFilters: jest.fn(),
    setStatusFilter: jest.fn(),
  }),
}));

jest.mock("../../hooks/useCarData", () => ({
  useCarData: (cars: CarModel[], _filter: string) => ({
    filteredCars: cars,
    carCounts: {
      total: 10,
      pending: 3,
      approved: 5,
      rejected: 2,
    },
  }),
}));

jest.mock("../../hooks/useCarActions", () => ({
  useCarActions: () => ({
    handleDelete: jest.fn(),
    handleEdit: jest.fn(),
  }),
}));

describe("DealerCarDashboard", () => {
  const mockCarData = {
    items: [
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
      {
        id: "2",
        title: "BMW X5",
        make: "BMW",
        model: "X5",
        transmission: "Automatic",
        status: "Pending",
        mileage: 22000,
        seats: 5,
        price: 65000,
        color: "Black",
        imageUrl: "https://example.com/bmw.jpg",
        createdAt: new Date(),
      },
    ] as CarModel[],
    hasMore: false,
    nextCursor: "",
  };

  it("renders the dashboard header", () => {
    render(<DealerCarDashboard carData={mockCarData} />);

    expect(screen.getByTestId("dashboard-header")).toBeInTheDocument();
  });

  it("renders all stats cards", () => {
    render(<DealerCarDashboard carData={mockCarData} />);

    expect(screen.getByText("Needs Attention: 2")).toBeInTheDocument();
    expect(screen.getByText("Under Review: 3")).toBeInTheDocument();
    expect(screen.getByText("Published: 5")).toBeInTheDocument();
    expect(screen.getByText("All Listings: 10")).toBeInTheDocument();
  });

  it("renders Available Vehicles heading", () => {
    render(<DealerCarDashboard carData={mockCarData} />);

    expect(screen.getByText("Available Vehicles")).toBeInTheDocument();
  });

  it("renders Browse and manage description", () => {
    render(<DealerCarDashboard carData={mockCarData} />);

    expect(
      screen.getByText("Browse and manage your car listings"),
    ).toBeInTheDocument();
  });

  it("renders Show Filters button", () => {
    render(<DealerCarDashboard carData={mockCarData} />);

    expect(screen.getByText("Show Filters")).toBeInTheDocument();
  });

  it("renders car list with cars", () => {
    render(<DealerCarDashboard carData={mockCarData} />);

    expect(screen.getByTestId("car-list")).toBeInTheDocument();
    expect(screen.getByText("Cars: 2")).toBeInTheDocument();
  });

  it("applies correct layout classes", () => {
    const { container } = render(<DealerCarDashboard carData={mockCarData} />);

    const mainContainer = container.querySelector("#car-main-container");
    expect(mainContainer).toHaveClass("min-h-screen", "bg-gray-50");
  });

  it("applies responsive grid to stats cards", () => {
    const { container } = render(<DealerCarDashboard carData={mockCarData} />);

    const statsGrid = container.querySelector(".grid");
    expect(statsGrid).toHaveClass("sm:grid-cols-2", "lg:grid-cols-4");
  });

  it("renders with empty car data", () => {
    const emptyData = {
      items: [],
      hasMore: false,
      nextCursor: "",
    };

    render(<DealerCarDashboard carData={emptyData} />);

    expect(screen.getByTestId("car-list")).toBeInTheDocument();
    expect(screen.getByText("Cars: 0")).toBeInTheDocument();
  });

  it("applies shadow and border to main container", () => {
    const { container } = render(<DealerCarDashboard carData={mockCarData} />);

    const leftSideContainer = container.querySelector("#left-side-container");
    expect(leftSideContainer).toHaveClass("shadow-sm");
  });

  it("applies backdrop blur to main container", () => {
    const { container } = render(<DealerCarDashboard carData={mockCarData} />);

    const leftSideContainer = container.querySelector("#left-side-container");
    expect(leftSideContainer).toHaveClass("backdrop-blur-sm");
  });
});
