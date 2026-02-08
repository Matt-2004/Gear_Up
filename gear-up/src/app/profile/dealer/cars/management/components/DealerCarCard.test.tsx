import { CarItems } from "@/app/types/car.types";
import { fireEvent, render, screen } from "@testing-library/react";
import DealerCarCard from "./DealerCarCard";

// Mock the CarCard component
jest.mock("@/components/Car/CarCard", () => ({
  CarCard: ({ carItem }: { carItem: CarItems }) => (
    <div data-testid="car-card">Car: {carItem.name}</div>
  ),
}));

describe("DealerCarCard", () => {
  const mockOnDelete = jest.fn();
  const mockOnEdit = jest.fn();

  const mockCar: CarItems = {
    id: "1",
    name: "Tesla Model 3",
    carValidationStatus: "Approved",
    price: 45000,
    mileage: 15000,
    year: 2022,
    brand: "Tesla",
    model: "Model 3",
    fuelType: "Electric",
    transmission: "Automatic",
    location: "San Francisco",
    imageUrl: "https://example.com/car.jpg",
    images: [],
    description: "Great car",
    dealerId: "dealer1",
  } as unknown as CarItems;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the CarCard component", () => {
    render(
      <DealerCarCard
        car={mockCar}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />,
    );

    expect(screen.getByTestId("car-card")).toBeInTheDocument();
    expect(screen.getByText("Car: Tesla Model 3")).toBeInTheDocument();
  });

  it("renders status badge with correct status", () => {
    render(
      <DealerCarCard
        car={mockCar}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />,
    );

    expect(screen.getByText("Approved")).toBeInTheDocument();
  });

  it("does not render status badge when status is missing", () => {
    const carWithoutStatus = {
      ...mockCar,
      carValidationStatus: undefined,
    } as unknown as CarItems;
    render(
      <DealerCarCard
        car={carWithoutStatus}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />,
    );

    expect(screen.queryByText("Approved")).not.toBeInTheDocument();
  });

  it("shows options button on hover", () => {
    const { container } = render(
      <DealerCarCard
        car={mockCar}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />,
    );

    const cardWrapper = container.firstChild as HTMLElement;
    fireEvent.mouseEnter(cardWrapper);

    const optionsButton = screen.getByLabelText("Car options");
    expect(optionsButton).toHaveClass("opacity-100");
  });

  it("hides options button when not hovered", () => {
    const { container } = render(
      <DealerCarCard
        car={mockCar}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />,
    );

    const cardWrapper = container.firstChild as HTMLElement;
    fireEvent.mouseLeave(cardWrapper);

    const optionsButton = screen.getByLabelText("Car options");
    expect(optionsButton).toHaveClass("opacity-0");
  });

  it("shows options menu when options button is hovered", () => {
    render(
      <DealerCarCard
        car={mockCar}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />,
    );

    const optionsButton = screen.getByLabelText("Car options");
    fireEvent.mouseEnter(optionsButton);

    expect(screen.getByText("Edit Vehicle")).toBeInTheDocument();
    expect(screen.getByText("Delete Vehicle")).toBeInTheDocument();
  });

  it("calls onEdit when Edit button is clicked", () => {
    render(
      <DealerCarCard
        car={mockCar}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />,
    );

    const optionsButton = screen.getByLabelText("Car options");
    fireEvent.mouseEnter(optionsButton);

    const editButton = screen.getByText("Edit Vehicle");
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith("1");
  });

  it("calls onDelete when Delete button is clicked", () => {
    render(
      <DealerCarCard
        car={mockCar}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />,
    );

    const optionsButton = screen.getByLabelText("Car options");
    fireEvent.mouseEnter(optionsButton);

    const deleteButton = screen.getByText("Delete Vehicle");
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith("1");
  });

  it("hides options menu when mouse leaves card", () => {
    const { container } = render(
      <DealerCarCard
        car={mockCar}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />,
    );

    const cardWrapper = container.firstChild as HTMLElement;
    const optionsButton = screen.getByLabelText("Car options");

    fireEvent.mouseEnter(cardWrapper);
    fireEvent.mouseEnter(optionsButton);
    expect(screen.getByText("Edit Vehicle")).toBeInTheDocument();

    fireEvent.mouseLeave(cardWrapper);
    expect(screen.queryByText("Edit Vehicle")).not.toBeInTheDocument();
  });

  it("renders different status badges correctly", () => {
    const { rerender } = render(
      <DealerCarCard
        car={{ ...mockCar, carValidationStatus: "Pending" }}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />,
    );
    expect(screen.getByText("Pending")).toBeInTheDocument();

    rerender(
      <DealerCarCard
        car={{ ...mockCar, carValidationStatus: "Rejected" }}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />,
    );
    expect(screen.getByText("Rejected")).toBeInTheDocument();
  });

  it("capitalizes first letter of status", () => {
    render(
      <DealerCarCard
        car={{ ...mockCar, carValidationStatus: "approved" as any }}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />,
    );

    expect(screen.getByText("Approved")).toBeInTheDocument();
  });
});
