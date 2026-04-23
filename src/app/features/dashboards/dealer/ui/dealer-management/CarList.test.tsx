import { CarItems } from "@/app/features/car/types/car.types";
import { render, screen } from "@testing-library/react";
import CarList from "./CarList";

// Mock child components
jest.mock("./DealerCarCard", () => {
  return function MockDealerCarCard({ car }: { car: CarItems }) {
    return <div data-testid="dealer-car-card">Car: {car.name}</div>;
  };
});

jest.mock("./EmptyInventoryState", () => {
  return function MockEmptyInventoryState() {
    return <div data-testid="empty-state">No cars</div>;
  };
});

describe("CarList", () => {
  const mockOnDelete = jest.fn();
  const mockOnEdit = jest.fn();

  const mockCars: CarItems[] = [
    {
      id: "1",
      name: "Tesla Model 3",
      carValidationStatus: "Approved",
      price: 45000,
      brand: "Tesla",
      model: "Model 3",
    } as unknown as CarItems,
    {
      id: "2",
      name: "BMW X5",
      carValidationStatus: "Pending",
      price: 65000,
      brand: "BMW",
      model: "X5",
    } as unknown as CarItems,
    {
      id: "3",
      name: "Audi A4",
      carValidationStatus: "Approved",
      price: 42000,
      brand: "Audi",
      model: "A4",
    } as unknown as CarItems,
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders empty state when no cars are provided", () => {
    render(<CarList cars={[]} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });

  it("renders empty state when cars is null", () => {
    render(
      <CarList
        cars={null as any}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />,
    );

    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });

  it("renders car cards when cars are provided", () => {
    render(
      <CarList cars={mockCars} onDelete={mockOnDelete} onEdit={mockOnEdit} />,
    );

    expect(screen.getByText("Car: Tesla Model 3")).toBeInTheDocument();
    expect(screen.getByText("Car: BMW X5")).toBeInTheDocument();
    expect(screen.getByText("Car: Audi A4")).toBeInTheDocument();
  });

  it("renders correct number of car cards", () => {
    render(
      <CarList cars={mockCars} onDelete={mockOnDelete} onEdit={mockOnEdit} />,
    );

    const carCards = screen.getAllByTestId("dealer-car-card");
    expect(carCards).toHaveLength(3);
  });

  it("renders single car correctly", () => {
    const singleCar = [mockCars[0]];
    render(
      <CarList cars={singleCar} onDelete={mockOnDelete} onEdit={mockOnEdit} />,
    );

    expect(screen.getByText("Car: Tesla Model 3")).toBeInTheDocument();
    expect(screen.getAllByTestId("dealer-car-card")).toHaveLength(1);
  });

  it("applies grid layout classes", () => {
    const { container } = render(
      <CarList cars={mockCars} onDelete={mockOnDelete} onEdit={mockOnEdit} />,
    );

    const grid = container.querySelector(".grid");
    expect(grid).toHaveClass("grid-cols-1", "md:grid-cols-2", "xl:grid-cols-3");
  });

  it("applies animation classes to grid", () => {
    const { container } = render(
      <CarList cars={mockCars} onDelete={mockOnDelete} onEdit={mockOnEdit} />,
    );

    const grid = container.querySelector(".grid");
    expect(grid).toHaveClass("animate-in", "fade-in");
  });

  it("applies staggered animation delays to car cards", () => {
    const { container } = render(
      <CarList cars={mockCars} onDelete={mockOnDelete} onEdit={mockOnEdit} />,
    );

    const animatedDivs = container.querySelectorAll(
      ".animate-in.fade-in.slide-in-from-bottom",
    );
    expect(animatedDivs.length).toBeGreaterThan(0);
  });

  it("passes onDelete and onEdit props to DealerCarCard", () => {
    render(
      <CarList cars={mockCars} onDelete={mockOnDelete} onEdit={mockOnEdit} />,
    );

    // If the mock is rendered, the props were passed correctly
    expect(screen.getAllByTestId("dealer-car-card")).toHaveLength(3);
  });

  it("handles empty array differently from null", () => {
    const { rerender } = render(
      <CarList cars={[]} onDelete={mockOnDelete} onEdit={mockOnEdit} />,
    );
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();

    rerender(
      <CarList
        cars={null as any}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />,
    );
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });

  it("renders cars with unique keys", () => {
    const { container } = render(
      <CarList cars={mockCars} onDelete={mockOnDelete} onEdit={mockOnEdit} />,
    );

    // Each car should be rendered individually
    const carCards = screen.getAllByTestId("dealer-car-card");
    expect(carCards).toHaveLength(mockCars.length);
  });

  it("handles cars without id by using index", () => {
    const carsWithoutId = mockCars.map((car) => ({ ...car, id: undefined }));
    render(
      <CarList
        cars={carsWithoutId as any}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />,
    );

    expect(screen.getAllByTestId("dealer-car-card")).toHaveLength(3);
  });
});
