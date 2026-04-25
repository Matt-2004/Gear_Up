import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Register from "../ui/Register";
import { useSignUp } from "../hooks/useSignUp";

jest.mock("../hooks/useSignUp", () => ({
  useSignUp: jest.fn(),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => {
    return <img src={src} alt={alt} {...props} />;
  },
}));

const mockedUseSignUp = useSignUp as jest.Mock;

const mockHandleFormSubmit = jest.fn((e) => e.preventDefault());
const mockSetFormDataSpy = jest.fn();

const defaultFormData = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  agreeToTerms: false,
};

function mockUseSignUpWithState(overrides = {}) {
  mockedUseSignUp.mockImplementation(() => {
    const [formData, realSetFormData] = React.useState(defaultFormData);

    const setFormData = (
      value:
        | typeof defaultFormData
        | ((prev: typeof defaultFormData) => typeof defaultFormData),
    ) => {
      mockSetFormDataSpy(value);
      realSetFormData(value);
    };

    return {
      formData,
      isPending: false,
      handleFormSubmit: mockHandleFormSubmit,
      setFormData,
      validationErrors: {},
      isFormValid: true,
      ...overrides,
    };
  });
}

describe("Register with userEvent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSignUpWithState();
  });

  it("updates first name input with userEvent", async () => {
    const user = userEvent.setup();

    render(<Register />);

    const firstNameInput = screen.getByTestId("first-name");

    await user.type(firstNameInput, "John");

    expect(firstNameInput).toHaveValue("John");
    expect(mockSetFormDataSpy).toHaveBeenCalled();
  });

  it("updates email and password inputs with userEvent", async () => {
    const user = userEvent.setup();

    render(<Register />);

    const emailInput = screen.getByTestId("email");
    const passwordInput = screen.getByTestId("password");

    await user.type(emailInput, "matt@example.com");
    await user.type(passwordInput, "password123");

    expect(emailInput).toHaveValue("matt@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  it("updates all register form fields with userEvent", async () => {
    const user = userEvent.setup();

    render(<Register />);

    await user.type(screen.getByTestId("first-name"), "John");
    await user.type(screen.getByTestId("last-name"), "Doe");
    await user.type(screen.getByTestId("username"), "john_doe");
    await user.type(screen.getByTestId("email"), "john@gmail.com");
    await user.type(screen.getByTestId("password"), "password123");
    await user.type(screen.getByTestId("confirm-password"), "password123");
    await user.click(screen.getByTestId("agree-to-terms"));

    expect(screen.getByTestId("first-name")).toHaveValue("John");
    expect(screen.getByTestId("last-name")).toHaveValue("Doe");
    expect(screen.getByTestId("username")).toHaveValue("john_doe");
    expect(screen.getByTestId("email")).toHaveValue("john@gmail.com");
    expect(screen.getByTestId("password")).toHaveValue("password123");
    expect(screen.getByTestId("confirm-password")).toHaveValue("password123");
    expect(screen.getByTestId("agree-to-terms")).toBeChecked();
  });

  it("submits the form with userEvent", async () => {
    const user = userEvent.setup();

    render(<Register />);

    await user.type(screen.getByTestId("first-name"), "John");
    await user.type(screen.getByTestId("last-name"), "Doe");
    await user.type(screen.getByTestId("username"), "john_doe");
    await user.type(screen.getByTestId("email"), "john@gmail.com");
    await user.type(screen.getByTestId("password"), "password123");
    await user.type(screen.getByTestId("confirm-password"), "password123");
    await user.click(screen.getByTestId("agree-to-terms"));

    await user.click(screen.getByRole("button", { name: /register/i }));

    expect(mockHandleFormSubmit).toHaveBeenCalledTimes(1);
  });

  it("renders auth navigation links with correct hrefs", () => {
    render(<Register />);

    const signInHereLink = screen.getByRole("link", {
      name: /sign in here/i,
    });

    const goBackHomeLink = screen.getByRole("link", {
      name: /go back home/i,
    });

    const loginNowLink = screen.getByRole("link", {
      name: /login now/i,
    });

    expect(signInHereLink).toHaveAttribute("href", "/auth/login");
    expect(goBackHomeLink).toHaveAttribute("href", "/");
    expect(loginNowLink).toHaveAttribute("href", "/auth/login");
  });
});
