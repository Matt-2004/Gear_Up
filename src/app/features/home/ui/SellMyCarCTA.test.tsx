import React from "react";
import { render, screen } from "@testing-library/react";
import SellMyCarCTA from "./SellMyCarCTA";

jest.mock("next/image", () => {
  function ImageMock({
    fill: _fill,
    priority: _priority,
    alt = "",
    ...props
  }: React.ComponentProps<"img"> & {
    fill?: boolean;
    priority?: boolean;
  }) {
    return React.createElement("img", { alt, ...props });
  }

  return {
    __esModule: true,
    default: ImageMock,
  };
});

jest.mock("next/link", () => {
  function LinkMock({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  return {
    __esModule: true,
    default: LinkMock,
  };
});

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("../../navbar/context/UserDataContext", () => ({
  useUserData: () => ({
    user: null,
  }),
}));

describe("SellMyCarCTA", () => {
  it("renders heading and supporting copy", () => {
    render(<SellMyCarCTA />);

    expect(
      screen.getByText(/maximize your vehicle's worth/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/industry's most precise marketing platform/i),
    ).toBeInTheDocument();
  });

  it("renders CTA link with dealer registration path", async () => {
    render(<SellMyCarCTA />);

    const ctaLink = screen.getByRole("link", { name: /sell my car now/i });
    expect(ctaLink).toHaveAttribute("href", "/profile/dealer/register?step=1");
  });

  it("renders hero image with accessible alt text", () => {
    render(<SellMyCarCTA />);

    expect(screen.getByAltText(/sell your car/i)).toBeInTheDocument();
  });
});
