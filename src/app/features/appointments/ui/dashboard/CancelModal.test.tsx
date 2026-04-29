import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CancelModal } from "./CancelModal";

describe("CancelModal", () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does not render when showInfo is false", () => {
    render(
      <CancelModal
        showInfo={false}
        carTitle="Toyota Corolla"
        loading={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />,
    );

    expect(screen.queryByText(/cancel appointment/i)).not.toBeInTheDocument();
  });

  it("renders modal content when showInfo is true", () => {
    render(
      <CancelModal
        showInfo={true}
        carTitle="Toyota Corolla"
        loading={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />,
    );

    expect(screen.getByText(/cancel appointment\?/i)).toBeInTheDocument();
    expect(screen.getByText(/toyota corolla/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /no, keep it/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /yes, cancel/i })).toBeInTheDocument();
  });

  it("calls close and confirm handlers on button clicks", async () => {
    const user = userEvent.setup();
    render(
      <CancelModal
        showInfo={true}
        carTitle="Toyota Corolla"
        loading={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />,
    );

    await user.click(screen.getByRole("button", { name: /no, keep it/i }));
    await user.click(screen.getByRole("button", { name: /yes, cancel/i }));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it("disables actions and shows loading label when loading", () => {
    render(
      <CancelModal
        showInfo={true}
        carTitle="Toyota Corolla"
        loading={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />,
    );

    expect(screen.getByRole("button", { name: /no, keep it/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /cancelling/i })).toBeDisabled();
  });
});
