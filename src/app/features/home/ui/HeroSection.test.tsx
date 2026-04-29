import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HeroSection from "./HeroSection";

const mockPush = jest.fn();
const mockPrefetch = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    prefetch: mockPrefetch,
  }),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ fill, priority, ...props }: any) => <img {...props} />,
}));

describe("HeroSection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("prefetches search page on mount", () => {
    render(<HeroSection />);

    expect(mockPrefetch).toHaveBeenCalledWith("/car/search");
  });

  it("navigates to search page when form is submitted", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<HeroSection />);

    const input = screen.getByPlaceholderText(/search by make, model, or year/i);
    await user.type(input, "Toyota Corolla");
    await user.click(screen.getByRole("button", { name: /^search$/i }));

    expect(mockPush).toHaveBeenCalledWith("/car/search?query=Toyota%20Corolla");
  });

  it("does not navigate when submitted query is empty", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<HeroSection />);

    await user.click(screen.getByRole("button", { name: /^search$/i }));

    expect(mockPush).not.toHaveBeenCalled();
  });

  it("shows suggestions and navigates when a suggestion is clicked", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<HeroSection />);

    const input = screen.getByPlaceholderText(/search by make, model, or year/i);
    await user.type(input, "toyota");

    act(() => {
      jest.advanceTimersByTime(300);
    });

    const suggestion = await screen.findByRole("button", { name: /^toyota$/i });
    await user.click(suggestion);

    expect(mockPush).toHaveBeenCalledWith("/car/search?query=Toyota");
  });
});
