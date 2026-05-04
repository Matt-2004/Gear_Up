import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FillDetails from "./FillDetails";

const mockPush = jest.fn();
const mockUpdateAddedCar = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => "/profile/dealer/cars/add",
  useSearchParams: () => ({
    get: (key: string) => (key === "step" ? "1" : null),
  }),
}));

jest.mock("../../context/AddNewCarContext", () => ({
  useVehicleContext: () => ({
    addedCar: undefined,
    updateAddedCar: mockUpdateAddedCar,
    isDraftReady: true,
  }),
}));

jest.mock("./StepNavigation", () => ({
  __esModule: true,
  default: () => (
    <button type="submit" aria-label="submit-listing">
      Submit Listing
    </button>
  ),
}));

describe("FillDetails", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows model input disabled until make is entered", async () => {
    render(<FillDetails />);
    const modelInput = screen.getByPlaceholderText(
      "e.g., Camry, Civic, Model 3",
    ) as HTMLInputElement;
    expect(modelInput).toBeDisabled();

    const makeInput = screen.getByPlaceholderText("e.g., Toyota, Honda, Tesla");
    await userEvent.type(makeInput, "Toyota");

    expect(modelInput).not.toBeDisabled();
  });

  it("formats price and mileage inputs with commas", async () => {
    render(<FillDetails />);

    const priceInput = screen.getByPlaceholderText("850,000");
    await userEvent.type(priceInput, "10000");
    expect(priceInput).toHaveValue("10,000");

    const mileageInput = screen.getByPlaceholderText("45,000");
    await userEvent.type(mileageInput, "90000");
    expect(mileageInput).toHaveValue("90,000");

    const priceHidden = document.querySelector(
      'input[name="PriceValue"]',
    ) as HTMLInputElement;
    const mileageHidden = document.querySelector(
      'input[name="MileageValue"]',
    ) as HTMLInputElement;

    expect(priceHidden.value).toBe("10000");
    expect(mileageHidden.value).toBe("90000");
  });

  it("submits form and calls updateAddedCar with input values", async () => {
    const user = userEvent.setup();
    render(<FillDetails />);

    await user.type(
      screen.getByPlaceholderText(
        "e.g., 2024 Toyota Camry - Excellent Condition",
      ),
      "2024 Toyota Camry",
    );
    await user.type(
      screen.getByPlaceholderText(
        "Describe the vehicle's key features, condition, and any recent maintenance or upgrades...",
      ),
      "Well maintained",
    );

    const makeInput = screen.getByPlaceholderText("e.g., Toyota, Honda, Tesla");
    await user.type(makeInput, "Toyota");
    await user.type(
      screen.getByPlaceholderText("e.g., Camry, Civic, Model 3"),
      "Camry",
    );

    const yearInput = screen.getByPlaceholderText("Select year");
    fireEvent.click(yearInput);
    const yearOption = await screen.findByRole("button", { name: "2024" });
    await user.click(yearOption);

    await user.type(screen.getByPlaceholderText("850,000"), "10000");
    await user.type(
      screen.getByPlaceholderText("e.g., Black, White, Silver"),
      "Black",
    );
    await user.type(screen.getByPlaceholderText("45,000"), "90000");
    await user.type(screen.getByPlaceholderText("e.g., 2.0"), "2.0");

    await user.click(screen.getByText("4 Seats"));
    await user.click(screen.getByText("Petrol"));
    await user.click(screen.getByText("Brand New"));
    await user.click(screen.getByText("Automatic"));

    await user.type(
      screen.getByPlaceholderText("e.g., 1HGBH41JXMN109186"),
      "1HGBH41JXMN109186",
    );
    await user.type(screen.getByPlaceholderText("e.g., ABC-1234"), "ABC-1234");

    await user.click(screen.getByLabelText("submit-listing"));

    expect(mockUpdateAddedCar).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "2024 Toyota Camry",
        description: "Well maintained",
        make: "Toyota",
        model: "Camry",
        year: 2024,
        price: 10000,
        color: "Black",
        mileage: 90000,
        seatingCapacity: 4,
        engineCapacity: 2,
        fuelType: "Petrol",
        carCondition: "New",
        transmissionType: "Automatic",
        vin: "1HGBH41JXMN109186",
        licensePlate: "ABC-1234",
      }),
    );

    expect(mockPush).toHaveBeenCalledWith("/profile/dealer/cars/add?step=2");
  });
});
