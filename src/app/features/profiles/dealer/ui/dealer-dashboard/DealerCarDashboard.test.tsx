import { render, screen } from "@testing-library/react";
import DealerCarDashboard from "./DealerCarDashboard";
import { CarModel } from "@/app/features/car/types/car.model";

// Mock child components
jest.mock("./management/components", () => ({
  CarList: ({ cars }: { cars: CarModel[] }) => (
    <div data-testid="car-list">Cars: {cars.length}</div>
  ),
  ConditionalCarFilter: () => (
    <div data-testid="conditional-filter">Filters</div>
  ),
  DashboardHeader: () => <div data-testid="dashboard-header">Header</div>,
  FilterDropdown: ({
    filter,
    onFilterChange,
  }: {
    filter: string;
    onFilterChange: (filter: string) => void;
  }) => (
    <div data-testid="filter-dropdown">
      <button onClick={() => onFilterChange("Pending")}>Change Filter</button>
      <span>Current: {filter}</span>
    </div>
  ),
  StatsCard: ({ label, value }: { label: string; value: number }) => (
    <div data-testid="stats-card">
      {label}: {value}
    </div>
  ),
}));

// Mock hooks
jest.mock("./management/hooks", () => ({
  useCarFilters: () => ({
    isFilterOpen: false,
    statusFilter: "All",
    statusDropdownOpen: false,
    toggleFilters: jest.fn(),
    toggleStatusDropdown: jest.fn(),
    setStatusFilter: jest.fn(),
  }),
  useCarData: (cars: CarModel[], filter: string) => ({
    filteredCars: cars,
    carCounts: {
      total: 10,
      pending: 3,
      approved: 5,
      rejected: 2,
    },
  }),
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
        name: "Tesla Model 3",
        carValidationStatus: "Approved",
      } as CarItems,
      {
        id: "2",
        name: "BMW X5",
        carValidationStatus: "Pending",
      } as CarItems,
    ],
    hasMore: false,
    nextCursor: "",
  };

  it("renders the dashboard header", () => {
    render(<DealerCarDashboard carData={mockCarData} />);

    expect(screen.getByTestId("dashboard-header")).toBeInTheDocument();
  });

  it("renders all stats cards", () => {
    render(<DealerCarDashboard carData={mockCarData} />);

    expect(screen.getByText("Total Cars: 10")).toBeInTheDocument();
    expect(screen.getByText("Pending Review: 3")).toBeInTheDocument();
    expect(screen.getByText("Approved: 5")).toBeInTheDocument();
    expect(screen.getByText("Rejected: 2")).toBeInTheDocument();
  });

  it("renders filter dropdown", () => {
    render(<DealerCarDashboard carData={mockCarData} />);

    expect(screen.getByTestId("filter-dropdown")).toBeInTheDocument();
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
    expect(mainContainer).toHaveClass("min-h-screen", "bg-linear-to-br");
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
    expect(leftSideContainer).toHaveClass("shadow-sm", "border");
  });

  it("applies backdrop blur to main container", () => {
    const { container } = render(<DealerCarDashboard carData={mockCarData} />);

    const leftSideContainer = container.querySelector("#left-side-container");
    expect(leftSideContainer).toHaveClass("backdrop-blur-sm");
  });

  it("renders with max-width container", () => {
    const { container } = render(<DealerCarDashboard carData={mockCarData} />);

    const maxWidthContainer = container.querySelector(".max-w-7xl");
    expect(maxWidthContainer).toBeInTheDocument();
  });
});
