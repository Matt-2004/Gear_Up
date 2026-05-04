import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Review from "./Review";

const mockUpdateAddedCar = jest.fn();
const mockClearAddedCar = jest.fn();
const mockHandleToast = jest.fn();
const mockAddToastMessage = jest.fn();
const mockAddCar = jest.fn();

type MockAddedCar = {
  title: string;
  description: string;
  model: string;
  make: string;
  year: number;
  price: number;
  color: string;
  mileage: number;
  seatingCapacity: number;
  engineCapacity: number;
  fuelType: string;
  carCondition: string;
  transmissionType: string;
  vin: string;
  licensePlate: string;
  carImages: File[];
};

const mockContextState: {
  addedCar: MockAddedCar | undefined;
  updateAddedCar: typeof mockUpdateAddedCar;
  clearAddedCar: typeof mockClearAddedCar;
  isDraftReady: boolean;
} = {
  addedCar: {
    title: "Toyota Camry",
    description: "Nice sedan",
    model: "Camry",
    make: "Toyota",
    year: 2024,
    price: 850000,
    color: "Black",
    mileage: 45000,
    seatingCapacity: 4,
    engineCapacity: 2.0,
    fuelType: "Petrol",
    carCondition: "New",
    transmissionType: "Automatic",
    vin: "1HGBH41JXMN109186",
    licensePlate: "ABC-1234",
    carImages: [new File(["file"], "car.jpg", { type: "image/jpeg" })],
  },
  updateAddedCar: mockUpdateAddedCar,
  clearAddedCar: mockClearAddedCar,
  isDraftReady: true,
};

jest.mock("../../context/AddNewCarContext", () => ({
  useVehicleContext: () => mockContextState,
}));

jest.mock("@/app/features/toast/hooks/useToast", () => ({
  useToast: () => ({
    handleToast: mockHandleToast,
    addToastMessage: mockAddToastMessage,
  }),
}));

jest.mock("@/app/shared/utils/API/CarAPI", () => ({
  addCar: (...args: unknown[]) => mockAddCar(...args),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

jest.mock("./StepNavigation", () => ({
  __esModule: true,
  default: ({ isSubmitting }: { isSubmitting?: boolean }) => (
    <button type="submit" aria-label="submit-review">
      {isSubmitting ? "Submitting..." : "Submit"}
    </button>
  ),
}));

jest.mock("@/app/features/post/ui/DiscoverPost", () => ({
  PostContent: ({ postContent }: { postContent: string }) => (
    <div>{postContent}</div>
  ),
}));

jest.mock("@/app/features/car/ui/car-card/CarCard", () => ({
  CarCard: () => <div data-testid="car-card">Car Preview</div>,
}));

describe("Review", () => {
  beforeAll(() => {
    global.URL.createObjectURL = jest.fn(() => "blob:review-url");
    global.URL.revokeObjectURL = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockContextState.addedCar = {
      title: "Toyota Camry",
      description: "Nice sedan",
      model: "Camry",
      make: "Toyota",
      year: 2024,
      price: 850000,
      color: "Black",
      mileage: 45000,
      seatingCapacity: 4,
      engineCapacity: 2.0,
      fuelType: "Petrol",
      carCondition: "New",
      transmissionType: "Automatic",
      vin: "1HGBH41JXMN109186",
      licensePlate: "ABC-1234",
      carImages: [new File(["file"], "car.jpg", { type: "image/jpeg" })],
    };
    mockContextState.isDraftReady = true;
  });

  it("renders review content and car preview", () => {
    render(<Review />);

    expect(screen.getByText("Review Your Listing")).toBeInTheDocument();
    expect(screen.getByTestId("car-card")).toBeInTheDocument();
    expect(screen.getByText("Toyota Camry")).toBeInTheDocument();
    expect(screen.getByText("Nice sedan")).toBeInTheDocument();
  });

  it("submits form and calls addCar with form data", async () => {
    const user = userEvent.setup();
    mockAddCar.mockResolvedValueOnce({ isSuccess: true });

    render(<Review />);

    await user.click(screen.getByLabelText("submit-review"));

    await waitFor(() => {
      expect(mockAddCar).toHaveBeenCalledTimes(1);
    });
    expect(mockClearAddedCar).toHaveBeenCalled();
    expect(mockHandleToast).toHaveBeenCalled();
  });

  it("shows draft loading when draft is not ready", () => {
    mockContextState.addedCar = undefined;
    mockContextState.isDraftReady = false;

    render(<Review />);

    expect(screen.getByText("Loading your saved draft...")).toBeInTheDocument();
  });
});
