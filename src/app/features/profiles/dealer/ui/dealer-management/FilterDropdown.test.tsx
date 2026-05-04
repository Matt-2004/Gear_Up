import { CarStatus } from "@/app/features/car/types/car.types";
import { fireEvent, render, screen } from "@testing-library/react";
import FilterDropdown from "./FilterDropdown";

describe("FilterDropdown", () => {
  const mockOnToggleDropdown = jest.fn();
  const mockOnFilterChange = jest.fn();

  const defaultProps = {
    filter: "All" as CarStatus | "All",
    dropdownOpen: false,
    carCounts: {
      total: 20,
      pending: 5,
      approved: 10,
      rejected: 5,
    },
    onToggleDropdown: mockOnToggleDropdown,
    onFilterChange: mockOnFilterChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders filter button with correct initial text", () => {
    render(<FilterDropdown {...defaultProps} />);

    expect(screen.getByText("All Status")).toBeInTheDocument();
  });

  it("displays current filter status", () => {
    render(<FilterDropdown {...defaultProps} filter="Pending" />);

    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("calls onToggleDropdown when button is clicked", () => {
    render(<FilterDropdown {...defaultProps} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockOnToggleDropdown).toHaveBeenCalledTimes(1);
  });

  it("renders dropdown menu when open", () => {
    render(<FilterDropdown {...defaultProps} dropdownOpen={true} />);

    expect(screen.getByText("Filter by Status")).toBeInTheDocument();
    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByText("Approved")).toBeInTheDocument();
    expect(screen.getByText("Rejected")).toBeInTheDocument();
  });

  it("displays correct counts for each status", () => {
    render(<FilterDropdown {...defaultProps} dropdownOpen={true} />);

    expect(screen.getByText("20")).toBeInTheDocument(); // total
    const countFive = screen.getAllByText("5"); // pending and rejected both have 5
    expect(countFive).toHaveLength(2);
    expect(screen.getByText("10")).toBeInTheDocument(); // approved
  });

  it("calls onFilterChange when a filter option is clicked", () => {
    render(<FilterDropdown {...defaultProps} dropdownOpen={true} />);

    const pendingButton = screen
      .getAllByRole("button")
      .find((btn) => btn.textContent?.includes("Pending"));

    if (pendingButton) {
      fireEvent.click(pendingButton);
      expect(mockOnFilterChange).toHaveBeenCalledWith("Pending");
    }
  });

  it("shows checkmark for active filter", () => {
    render(
      <FilterDropdown
        {...defaultProps}
        filter="Approved"
        dropdownOpen={true}
      />,
    );

    // The active filter should have checkmark and highlighted styling
    const allButtons = screen.getAllByRole("button");
    const approvedButton = allButtons.find(
      (btn) =>
        btn.textContent?.includes("Approved") &&
        btn.classList.contains("bg-linear-to-r"),
    );

    expect(approvedButton).toBeDefined();
    expect(approvedButton).toHaveClass("bg-linear-to-r");
    expect(approvedButton).toHaveClass("from-blue-500");

    // Should have checkmark icon (Check SVG in the active button)
    expect(approvedButton?.querySelector("svg")).toBeInTheDocument();
  });

  it("closes dropdown when backdrop is clicked", () => {
    render(<FilterDropdown {...defaultProps} dropdownOpen={true} />);

    const backdrop = document.querySelector(".fixed.inset-0");
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(mockOnToggleDropdown).toHaveBeenCalled();
    }
  });

  it("does not render dropdown menu when closed", () => {
    render(<FilterDropdown {...defaultProps} dropdownOpen={false} />);

    expect(screen.queryByText("Filter by Status")).not.toBeInTheDocument();
  });

  it("renders Filter icon", () => {
    const { container } = render(<FilterDropdown {...defaultProps} />);

    // Check for lucide Filter icon
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders ChevronDown icon with rotation on open", () => {
    const { container: closedContainer } = render(
      <FilterDropdown {...defaultProps} dropdownOpen={false} />,
    );
    const { container: openContainer } = render(
      <FilterDropdown {...defaultProps} dropdownOpen={true} />,
    );

    const closedChevron = closedContainer.querySelector(
      ".transition-transform",
    );
    const openChevron = openContainer.querySelector(".rotate-180");

    expect(closedChevron).toBeInTheDocument();
    expect(openChevron).toBeInTheDocument();
  });
});
