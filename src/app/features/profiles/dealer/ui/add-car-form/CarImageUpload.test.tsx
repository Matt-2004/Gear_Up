import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CarImageUpload from "./CarImageUpload";

const mockPush = jest.fn();
const mockUpdateAddedCar = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => "/profile/dealer/cars/add",
  useSearchParams: () => ({
    get: (key: string) => (key === "step" ? "2" : null),
  }),
}));

jest.mock("../../context/AddNewCarContext", () => ({
  useVehicleContext: () => ({
    addedCar: undefined,
    updateAddedCar: mockUpdateAddedCar,
    isDraftReady: true,
  }),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

jest.mock("./StepNavigation", () => ({
  __esModule: true,
  default: () => (
    <button type="submit" aria-label="submit-images">
      Submit
    </button>
  ),
}));

describe("CarImageUpload", () => {
  beforeAll(() => {
    global.URL.createObjectURL = jest.fn(() => "blob:mock-url");
    global.URL.revokeObjectURL = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows empty state when no files are selected", () => {
    render(<CarImageUpload />);

    expect(
      screen.getByText("Drag & drop images or click to upload"),
    ).toBeInTheDocument();
    expect(screen.getByText("0 selected")).toBeInTheDocument();
  });

  it("adds files and renders upload list", async () => {
    render(<CarImageUpload />);

    const fileInput = document.querySelector(
      'input[type="file"][multiple]',
    ) as HTMLInputElement;

    const file = new File(["file"], "car.jpg", { type: "image/jpeg" });

    await userEvent.upload(fileInput, file);

    expect(await screen.findByText("Uploaded Images (1)")).toBeInTheDocument();
    expect(screen.getByText("car.jpg")).toBeInTheDocument();
    expect(screen.getByText("Uploading...")).toBeInTheDocument();
  });

  it("removes a file when remove button is clicked", async () => {
    render(<CarImageUpload />);

    const fileInput = document.querySelector(
      'input[type="file"][multiple]',
    ) as HTMLInputElement;

    const file = new File(["file"], "remove.jpg", { type: "image/jpeg" });

    await userEvent.upload(fileInput, file);

    const removeButton = await screen.findByTitle("Remove image");
    fireEvent.click(removeButton);

    expect(screen.queryByText("remove.jpg")).not.toBeInTheDocument();
  });

  it("submits selected files and navigates to next step", async () => {
    render(<CarImageUpload />);

    const fileInput = document.querySelector(
      'input[type="file"][multiple]',
    ) as HTMLInputElement;

    const file = new File(["file"], "submit.jpg", { type: "image/jpeg" });
    await userEvent.upload(fileInput, file);

    await userEvent.click(screen.getByLabelText("submit-images"));

    expect(mockUpdateAddedCar).toHaveBeenCalledWith({
      carImages: [file],
    });
    expect(mockPush).toHaveBeenCalledWith("/profile/dealer/cars/add?step=3");
  });
});
