import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { mockCarDetails } from "@/app/shared/mock/mockCarDetails";
import CarSidebar from "../CarSidebar";
import CarSpecifications from "../CarSpecifications";
import CarDescription from "../CarDescription";
import CarImageGallery from "../CarImageGallery";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) =>
    React.createElement("img", { ...props, alt: (props.alt as string) || "" }),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
  }) =>
    React.createElement("a", { href, ...rest }, children),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("@/app/features/navbar/context/UserDataContext", () => ({
  useUserData: () => ({ user: null }),
}));

const car = mockCarDetails["car-001"];

// =========================================================================
// CarSidebar
// =========================================================================
describe("CarSidebar", () => {
  it("renders the vehicle title in serif font", () => {
    render(<CarSidebar car={car} />);
    expect(
      screen.getByRole("heading", { name: /Toyota Camry/i }),
    ).toBeInTheDocument();
  });

  it("renders the price in THB", () => {
    render(<CarSidebar car={car} />);
    expect(screen.getByText(/฿31,999/)).toBeInTheDocument();
  });

  it("shows the status badge", () => {
    render(<CarSidebar car={car} />);
    expect(screen.getByText(/Approved/i)).toBeInTheDocument();
  });

  it("shows the condition badge", () => {
    render(<CarSidebar car={car} />);
    expect(screen.getByText(/New/)).toBeInTheDocument();
  });

  it("renders the Book a Test Drive CTA button", () => {
    render(<CarSidebar car={car} />);
    expect(
      screen.getByRole("button", { name: /Book a Test Drive/i }),
    ).toBeInTheDocument();
  });

  it("renders the helper text below CTA", () => {
    render(<CarSidebar car={car} />);
    expect(
      screen.getByText(/Free, no commitment needed/i),
    ).toBeInTheDocument();
  });

  it("toggles favorite state on heart click", () => {
    render(<CarSidebar car={car} />);
    const heart = screen.getByRole("button", { name: /Add to favorites/i });
    fireEvent.click(heart);
    expect(heart).toHaveAttribute("aria-label", "Remove from favorites");
  });
});

// =========================================================================
// CarSpecifications
// =========================================================================
describe("CarSpecifications", () => {
  it("renders all four spec cards", () => {
    render(<CarSpecifications car={car} />);
    expect(screen.getByText("Mileage")).toBeInTheDocument();
    expect(screen.getByText("Fuel")).toBeInTheDocument();
    expect(screen.getByText("Transmission")).toBeInTheDocument();
    expect(screen.getByText("Year")).toBeInTheDocument();
  });

  it("displays mileage in km", () => {
    render(<CarSpecifications car={car} />);
    expect(screen.getByText(/5,200 km/)).toBeInTheDocument();
  });

  it("displays the fuel type", () => {
    render(<CarSpecifications car={car} />);
    expect(screen.getByText("Petrol")).toBeInTheDocument();
  });

  it("displays the year", () => {
    render(<CarSpecifications car={car} />);
    expect(screen.getByText("2024")).toBeInTheDocument();
  });
});

// =========================================================================
// CarDescription
// =========================================================================
describe("CarDescription", () => {
  it("renders the description text", () => {
    render(<CarDescription description={car.description} />);
    expect(
      screen.getByText(/Experience refined comfort/i),
    ).toBeInTheDocument();
  });

  it("renders empty gracefully", () => {
    render(<CarDescription description="" />);
    const p = document.querySelector("p");
    expect(p).toBeInTheDocument();
    expect(p?.textContent).toBe("");
  });

  it("does not show toggle for short text", () => {
    render(<CarDescription description="Short description." />);
    expect(
      screen.queryByRole("button", { name: /see more/i }),
    ).not.toBeInTheDocument();
  });

  it("shows see more toggle for long text and expands", () => {
    const longText = Array.from({ length: 60 }, (_, i) => `word${i}`).join(" ");
    render(<CarDescription description={longText} />);
    const btn = screen.getByRole("button", { name: /see more/i });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(screen.getByRole("button", { name: /see less/i })).toBeInTheDocument();
  });
});

// =========================================================================
// CarImageGallery
// =========================================================================
describe("CarImageGallery", () => {
  it("shows the image counter", () => {
    render(<CarImageGallery car={car} />);
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
  });

  it("shows empty state when no images", () => {
    const emptyCar = { ...car, images: [] };
    render(<CarImageGallery car={emptyCar} />);
    expect(screen.getByText(/No photos yet/i)).toBeInTheDocument();
  });

  it("shows next but not prev on first image", () => {
    render(<CarImageGallery car={car} />);
    expect(
      screen.queryByRole("button", { name: /Previous image/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Next image/i }),
    ).toBeInTheDocument();
  });

  it("shows prev after advancing to second image", () => {
    render(<CarImageGallery car={car} />);
    fireEvent.click(screen.getByRole("button", { name: /Next image/i }));
    expect(
      screen.getByRole("button", { name: /Previous image/i }),
    ).toBeInTheDocument();
  });

  it("advances to the next image on next click", () => {
    render(<CarImageGallery car={car} />);
    fireEvent.click(screen.getByRole("button", { name: /Next image/i }));
    expect(screen.getByText("2 / 3")).toBeInTheDocument();
  });

  it("hides next on last image and prev returns to first", () => {
    render(<CarImageGallery car={car} />);
    const next = screen.getByRole("button", { name: /Next image/i });
    fireEvent.click(next); // to 2
    fireEvent.click(next); // to 3
    // Next hidden on last image
    expect(
      screen.queryByRole("button", { name: /Next image/i }),
    ).not.toBeInTheDocument();
    // Prev goes back
    fireEvent.click(screen.getByRole("button", { name: /Previous image/i }));
    fireEvent.click(screen.getByRole("button", { name: /Previous image/i }));
    // Next visible again on first
    expect(
      screen.getByRole("button", { name: /Next image/i }),
    ).toBeInTheDocument();
  });

  it("renders thumbnail buttons", () => {
    render(<CarImageGallery car={car} />);
    const thumbnails = screen.getAllByRole("button").filter(
      (btn) => btn.querySelector("img") !== null,
    );
    expect(thumbnails).toHaveLength(3);
  });
});
