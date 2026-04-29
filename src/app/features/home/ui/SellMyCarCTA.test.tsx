import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SellMyCarCTA from "./SellMyCarCTA";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ fill, priority, ...props }: any) => <img {...props} />,
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("SellMyCarCTA", () => {
  it("renders heading and supporting copy", () => {
    render(<SellMyCarCTA />);

    expect(screen.getByText(/maximize your vehicle's worth/i)).toBeInTheDocument();
    expect(
      screen.getByText(/list your car on the industry's most precise marketing/i),
    ).toBeInTheDocument();
  });

  it("renders CTA link with dealer registration path", async () => {
    const user = userEvent.setup();
    render(<SellMyCarCTA />);

    const ctaLink = screen.getByRole("link", { name: /sell my car now/i });
    await user.click(ctaLink);

    expect(ctaLink).toHaveAttribute("href", "/profile/dealer/register?step=1");
  });

  it("renders hero image with accessible alt text", () => {
    render(<SellMyCarCTA />);

    expect(screen.getByAltText(/sell your car/i)).toBeInTheDocument();
  });
});
