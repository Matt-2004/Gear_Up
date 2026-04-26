import { render, screen } from "@testing-library/react";
import AdminCarVerification from "../ui/cars/AdminCarVerification";
import { CursorResponse } from "@/app/shared/types.ts/cursor-response";
import { AdminCarData } from "@/app/features/dashboards/admin/types/admin-car-approval.types";

jest.mock("../context/AdminFilterContext", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="admin-filter-provider">{children}</div>
  ),
}));

jest.mock("../ui/dashboard/FilterUI", () => ({
  __esModule: true,
  FilterUI: ({ category }: { category: string }) => (
    <div data-testid="filter-ui" data-category={category}>
      Filter UI - {category}
    </div>
  ),
}));

jest.mock("../ui/dashboard/DataTable", () => ({
  __esModule: true,
  default: ({ data }: { data: { type: string; data: unknown[] } }) => (
    <div
      data-testid="data-table"
      data-type={data.type}
      data-count={data.data.length}
    >
      DataTable - {data.type}
    </div>
  ),
}));

jest.mock(
  "@/app/features/dashboards/dealer/ui/dealer-management/StatsCard",
  () => ({
    __esModule: true,
    default: ({
      label,
      value,
      variant,
      category,
    }: {
      label: string;
      value: number;
      variant: string;
      category?: string;
    }) => (
      <div
        data-testid="stats-card"
        data-label={label}
        data-value={value}
        data-variant={variant}
        data-category={category ?? ""}
      >
        {label}: {value}
      </div>
    ),
  }),
);

const createCars = (): CursorResponse<AdminCarData[]> =>
  ({
    items: [
      {
        id: "car-1",
        title: "Toyota Camry",
        price: 20000,
        carValidationStatus: "Pending",
      },
      {
        id: "car-2",
        title: "Honda Civic",
        price: 18000,
        carValidationStatus: "Approved",
      },
      {
        id: "car-3",
        title: "BMW X5",
        price: 50000,
        carValidationStatus: "Rejected",
      },
      {
        id: "car-4",
        title: "Tesla Model 3",
        price: 42000,
        carValidationStatus: "Pending",
      },
    ],
  }) as unknown as CursorResponse<AdminCarData[]>;

describe("AdminCarVerification", () => {
  it("renders fallback message when cars data is missing", () => {
    render(
      <AdminCarVerification
        cars={null as unknown as CursorResponse<AdminCarData[]>}
      />,
    );

    expect(screen.getByText("Car data missing")).toBeInTheDocument();
  });

  it("renders the page heading and description", () => {
    render(<AdminCarVerification cars={createCars()} />);

    expect(
      screen.getByRole("heading", { name: "Car Verification" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Review and verify dealer-submitted car listings"),
    ).toBeInTheDocument();
  });

  it("renders correct car stats counts", () => {
    render(<AdminCarVerification cars={createCars()} />);

    expect(screen.getByText("All Cars: 4")).toBeInTheDocument();
    expect(screen.getByText("Pending Cars: 2")).toBeInTheDocument();
    expect(screen.getByText("Approved Cars: 1")).toBeInTheDocument();
    expect(screen.getByText("Rejected Cars: 1")).toBeInTheDocument();
  });

  it("renders FilterUI with Car category", () => {
    render(<AdminCarVerification cars={createCars()} />);

    const filterUI = screen.getByTestId("filter-ui");

    expect(filterUI).toBeInTheDocument();
    expect(filterUI).toHaveAttribute("data-category", "Car");
  });

  it("passes car data to DataTable", () => {
    render(<AdminCarVerification cars={createCars()} />);

    const dataTable = screen.getByTestId("data-table");

    expect(dataTable).toBeInTheDocument();
    expect(dataTable).toHaveAttribute("data-type", "car");
    expect(dataTable).toHaveAttribute("data-count", "4");
  });

  it("wraps content with AdminFilterProvider", () => {
    render(<AdminCarVerification cars={createCars()} />);

    expect(screen.getByTestId("admin-filter-provider")).toBeInTheDocument();
  });
});
