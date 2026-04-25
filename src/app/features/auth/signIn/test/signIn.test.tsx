// Login.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../ui/Login";
import userEvent from "@testing-library/user-event";

const mockHandleFormSubmit = jest.fn((e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
});

let mockIsPending = false;

const mockInitialFormData = {
  usernameOrEmail: "",
  password: "",
  rememberMe: false,
};

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    fill,
    priority,
    blurDataURL,
    placeholder,
    quality,
    sizes,
    ...props
  }: any) => {
    return <img {...props} />;
  },
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children, ...props }: any) => {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  },
}));

jest.mock("../hooks/useSignIn", () => {
  const React = require("react");

  return {
    useSignIn: () => {
      const [formData, setFormData] = React.useState(() => ({
        ...mockInitialFormData,
      }));

      return {
        isPending: mockIsPending,
        handleFormSubmit: mockHandleFormSubmit,
        formData,
        setFormData,
      };
    },
  };
});

describe("Login", () => {
  beforeEach(() => {
    mockIsPending = false;
    mockHandleFormSubmit.mockClear();
  });

  it("focuses the username/email input on page load", () => {
    render(<Login />);

    expect(screen.getByTestId("email")).toHaveFocus();
  });

  it("allows user to type email/username and password", async () => {
    const user = userEvent.setup();

    render(<Login />);

    const emailInput = screen.getByTestId("email");
    const passwordInput = screen.getByTestId("password");

    await user.type(emailInput, "matt@example.com");
    await user.type(passwordInput, "password123");

    expect(emailInput).toHaveValue("matt@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  it("toggles remember me checkbox", async () => {
    const user = userEvent.setup();

    render(<Login />);

    const rememberMeCheckbox = screen.getByRole("checkbox", {
      name: /remember me/i,
    });

    expect(rememberMeCheckbox).not.toBeChecked();

    await user.click(rememberMeCheckbox);

    expect(rememberMeCheckbox).toBeChecked();
  });

  it("submits the form when Login button is clicked", async () => {
    const user = userEvent.setup();

    render(<Login />);

    const loginButton = screen.getByRole("button", {
      name: /login/i,
    });

    await user.click(loginButton);

    expect(mockHandleFormSubmit).toHaveBeenCalledTimes(1);
  });

  it("disables the Login button when pending", () => {
    mockIsPending = true;

    render(<Login />);

    const loginButton = screen.getByRole("button", {
      name: /processing/i,
    });

    expect(loginButton).toBeDisabled();
  });

  it("allows user to navigate to the registration page", async () => {
    const user = userEvent.setup();

    render(<Login />);

    const registerLink = screen.getByRole("link", {
      name: /register now/i,
    });

    await user.click(registerLink);

    expect(registerLink).toHaveAttribute("href", "/auth/register");
  });
});
