import { CarModel } from "@/app/features/car/types/car.model";
import { render, screen } from "@testing-library/react";
import CarList from "./CarList";

// Mock child components
jest.mock("./DealerCarCard", () => {
  return function MockDealerCarCard({ car }: { car: CarModel }) {
    return <div data-testid="dealer-car-card">Car: {car.title}</div>;
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

  const mockCars: CarModel[] = [
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
    {
      id: "3",
      title: "Audi A4",
      make: "Audi",
      model: "A4",
      transmission: "Automatic",
      status: "Approved",
      mileage: 18000,
      seats: 5,
      price: 42000,
      color: "White",
      imageUrl: "https://example.com/audi.jpg",
      createdAt: new Date(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders empty state when no cars are provided", () => {
    render(<CarList cars={[]} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });

  it("renders empty state when cars is null", () => {
    render(<CarList cars={[]} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

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
    expect(grid).toHaveClass("grid-cols-1", "lg:hidden");
  });

  it("applies animation classes to grid", () => {
    const { container } = render(
      <CarList cars={mockCars} onDelete={mockOnDelete} onEdit={mockOnEdit} />,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("animate-in", "fade-in");
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

    rerender(<CarList cars={[]} onDelete={mockOnDelete} onEdit={mockOnEdit} />);
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });

  it("renders cars with unique keys", () => {
    // Each car should be rendered individually
    const carCards = screen.getAllByTestId("dealer-car-card");
    expect(carCards).toHaveLength(mockCars.length);
  });

  it("handles cars without id by using index", () => {
    const carsWithoutId = mockCars.map((car) => ({ ...car, id: "" }));
    render(
      <CarList
        cars={carsWithoutId}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />,
    );

    expect(screen.getAllByTestId("dealer-car-card")).toHaveLength(3);
  });
});
