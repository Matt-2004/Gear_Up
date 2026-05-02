import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AppointmentFilterDropdown from "./AppointmentFilterDropdown";

describe("AppointmentFilterDropdown", () => {
  const mockOnToggleDropdown = jest.fn();
  const mockOnFilterChange = jest.fn();

  const defaultProps = {
    filter: "All" as const,
    dropdownOpen: false,
    appointmentCounts: {
      total: 15,
      pending: 4,
      cancelled: 2,
      confirmed: 5,
      completed: 3,
      rejected: 1,
    },
    onToggleDropdown: mockOnToggleDropdown,
    onFilterChange: mockOnFilterChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders trigger button and current filter text", () => {
    render(<AppointmentFilterDropdown {...defaultProps} />);

    expect(
      screen.getByRole("button", { name: /all status/i }),
    ).toBeInTheDocument();
  });

  it("calls toggle handler when trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<AppointmentFilterDropdown {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: /all status/i }));

    expect(mockOnToggleDropdown).toHaveBeenCalledTimes(1);
  });

  it("renders dropdown options with counts when open", () => {
    render(<AppointmentFilterDropdown {...defaultProps} dropdownOpen={true} />);

    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByText("Cancelled")).toBeInTheDocument();
    expect(screen.getByText("Confirmed")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText("Rejected")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
  });

  it("calls filter change when selecting an option", async () => {
    const user = userEvent.setup();
    render(<AppointmentFilterDropdown {...defaultProps} dropdownOpen={true} />);

    await user.click(screen.getByRole("button", { name: /confirmed/i }));

    expect(mockOnFilterChange).toHaveBeenCalledWith("Scheduled");
  });

  it("calls toggle when backdrop is clicked", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <AppointmentFilterDropdown {...defaultProps} dropdownOpen={true} />,
    );

    const backdrop = container.querySelector(".fixed.inset-0");
    expect(backdrop).toBeInTheDocument();

    await user.click(backdrop as Element);
    expect(mockOnToggleDropdown).toHaveBeenCalledTimes(1);
  });
});
