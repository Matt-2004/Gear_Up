import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EmailValidation from "../ui/emailValidation";
import { useEmailValidation } from "../hooks/useEmailValidation";

jest.mock("../hooks/useEmailValidation", () => ({
  useEmailValidation: jest.fn(),
}));

const mockedUseEmailValidation = useEmailValidation as jest.Mock;

const mockHandleFormSubmit = jest.fn((e) => e.preventDefault());

const defaultFormData = {
  email: "",
};

function mockUseEmailValidationWithState(overrides = {}) {
  mockedUseEmailValidation.mockImplementation(() => {
    const [formData, setFormData] = React.useState(defaultFormData);

    return {
      isPending: false,
      handleFormSubmit: mockHandleFormSubmit,
      formData,
      setFormData,
      validationErrors: {},
      isFormValid: true,
      ...overrides,
    };
  });
}

const getEmailInput = () => screen.getByTestId("email");

describe("EmailValidation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseEmailValidationWithState();
  });

  it("passes reset-password variant to useEmailValidation", () => {
    render(<EmailValidation variant="reset-password" />);

    expect(mockedUseEmailValidation).toHaveBeenCalledWith("reset-password");
  });

  it("passes verification variant to useEmailValidation", () => {
    render(<EmailValidation variant="verification" />);

    expect(mockedUseEmailValidation).toHaveBeenCalledWith("verification");
  });

  it("renders reset password variant content", () => {
    render(<EmailValidation variant="reset-password" />);

    expect(screen.getByText(/reset password/i)).toBeInTheDocument();

    expect(
      screen.getByText(/enter the email address associated with your account/i),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /send reset link/i }),
    ).toBeInTheDocument();

    expect(getEmailInput()).toBeInTheDocument();

    expect(screen.getByRole("link", { name: /login now/i })).toHaveAttribute(
      "href",
      "/auth/login",
    );
  });

  it("renders verification variant content", () => {
    render(<EmailValidation variant="verification" />);

    expect(screen.getByText(/email verification/i)).toBeInTheDocument();

    expect(
      screen.getByText(/enter your email to receive a verification link/i),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /send verification email/i,
      }),
    ).toBeInTheDocument();

    expect(getEmailInput()).toBeInTheDocument();

    expect(screen.getByRole("link", { name: /login now/i })).toHaveAttribute(
      "href",
      "/auth/login",
    );
  });

  it("updates email input with userEvent", async () => {
    const user = userEvent.setup();

    render(<EmailValidation variant="reset-password" />);

    await user.type(getEmailInput(), "matt@example.com");

    expect(getEmailInput()).toHaveValue("matt@example.com");
  });

  it("calls handleFormSubmit when reset password form is submitted", async () => {
    const user = userEvent.setup();

    render(<EmailValidation variant="reset-password" />);

    await user.type(getEmailInput(), "matt@example.com");

    await user.click(screen.getByRole("button", { name: /send reset link/i }));

    expect(mockHandleFormSubmit).toHaveBeenCalledTimes(1);
  });

  it("calls handleFormSubmit when verification form is submitted", async () => {
    const user = userEvent.setup();

    render(<EmailValidation variant="verification" />);

    await user.type(getEmailInput(), "matt@example.com");

    await user.click(
      screen.getByRole("button", {
        name: /send verification email/i,
      }),
    );

    expect(mockHandleFormSubmit).toHaveBeenCalledTimes(1);
  });

  it("disables button when form is invalid", () => {
    mockedUseEmailValidation.mockReturnValue({
      isPending: false,
      handleFormSubmit: mockHandleFormSubmit,
      formData: defaultFormData,
      setFormData: jest.fn(),
      validationErrors: {},
      isFormValid: false,
    });

    render(<EmailValidation variant="reset-password" />);

    expect(
      screen.getByRole("button", { name: /send reset link/i }),
    ).toBeDisabled();
  });

  it("shows loading state when request is pending", () => {
    mockedUseEmailValidation.mockReturnValue({
      isPending: true,
      handleFormSubmit: mockHandleFormSubmit,
      formData: defaultFormData,
      setFormData: jest.fn(),
      validationErrors: {},
      isFormValid: true,
    });

    render(<EmailValidation variant="reset-password" />);

    expect(screen.getByRole("button", { name: /processing/i })).toBeDisabled();
  });

  it("shows email validation error when input is focused and has value", () => {
    mockedUseEmailValidation.mockReturnValue({
      isPending: false,
      handleFormSubmit: mockHandleFormSubmit,
      formData: {
        email: "wrong-email",
      },
      setFormData: jest.fn(),
      validationErrors: {
        email: "Invalid email",
      },
      isFormValid: false,
    });

    render(<EmailValidation variant="reset-password" />);

    getEmailInput().focus();

    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
  });
});
