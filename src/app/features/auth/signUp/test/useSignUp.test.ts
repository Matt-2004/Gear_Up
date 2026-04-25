import { act, renderHook, waitFor } from "@testing-library/react";
import { useSignUp } from "../hooks/useSignUp";
import { useAuthForm } from "@/app/shared/hooks/useAuthForm";
import { useToast } from "@/app/features/toast/hooks/useToast";
import { signUpAction } from "../utils/signUpAction";

jest.mock("@/app/shared/hooks/useAuthForm", () => ({
  useAuthForm: jest.fn(),
}));

jest.mock("@/app/features/toast/hooks/useToast", () => ({
  useToast: jest.fn(),
}));

jest.mock("../utils/signUpAction", () => ({
  signUpAction: jest.fn(),
}));

const mockedUseAuthForm = useAuthForm as jest.Mock;
const mockedUseToast = useToast as jest.Mock;
const mockedSignUpAction = signUpAction as jest.Mock;

const mockSetFormData = jest.fn();
const mockHandleToast = jest.fn();

const defaultFormData = {
  firstName: "Matt",
  lastName: "Dev",
  username: "matt_dev",
  email: "matt@example.com",
  password: "password123",
  confirmPassword: "password123",
  agreeToTerms: true,
};

function mockUseAuthFormReturn(overrides = {}) {
  mockedUseAuthForm.mockReturnValue({
    formData: defaultFormData,
    setFormData: mockSetFormData,
    validationErrors: {},
    isFormValid: true,
    ...overrides,
  });
}

function createMockSubmitEvent() {
  return {
    preventDefault: jest.fn(),
  } as unknown as React.FormEvent<HTMLFormElement>;
}

describe("useSignUp", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseToast.mockReturnValue({
      handleToast: mockHandleToast,
    });

    mockUseAuthFormReturn();
  });

  it("returns initial hook values from useAuthForm", () => {
    const { result } = renderHook(() => useSignUp());

    expect(result.current.isPending).toBe(false);
    expect(result.current.formData).toEqual(defaultFormData);
    expect(result.current.setFormData).toBe(mockSetFormData);
    expect(result.current.validationErrors).toEqual({});
    expect(result.current.isFormValid).toBe(true);
    expect(typeof result.current.handleFormSubmit).toBe("function");
  });

  it("submits register form data correctly", async () => {
    const successResponse = {
      isSuccess: true,
      message: "Registration successful",
      data: null,
      status: 201,
    };

    mockedSignUpAction.mockResolvedValue(successResponse);

    const { result } = renderHook(() => useSignUp());

    const mockEvent = createMockSubmitEvent();

    await act(async () => {
      await result.current.handleFormSubmit(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);

    expect(mockedSignUpAction).toHaveBeenCalledTimes(1);

    const submittedFormData = mockedSignUpAction.mock.calls[0][0] as FormData;

    expect(submittedFormData.get("firstName")).toBe("Matt");
    expect(submittedFormData.get("lastName")).toBe("Dev");
    expect(submittedFormData.get("username")).toBe("matt_dev");
    expect(submittedFormData.get("email")).toBe("matt@example.com");
    expect(submittedFormData.get("password")).toBe("password123");
    expect(submittedFormData.get("confirmPassword")).toBe("password123");
    expect(submittedFormData.get("agreeToTerms")).toBe("true");

    expect(mockHandleToast).toHaveBeenCalledWith(
      successResponse,
      "/auth/login",
    );

    expect(result.current.isPending).toBe(false);
  });

  it("sets isPending to true while sign up request is running", async () => {
    let resolveSignUpAction!: (value: unknown) => void;

    const pendingPromise = new Promise((resolve) => {
      resolveSignUpAction = resolve;
    });

    mockedSignUpAction.mockReturnValue(pendingPromise);

    const { result } = renderHook(() => useSignUp());

    const mockEvent = createMockSubmitEvent();

    let submitPromise!: Promise<void>;

    act(() => {
      submitPromise = result.current.handleFormSubmit(mockEvent);
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });

    await act(async () => {
      resolveSignUpAction({
        isSuccess: true,
        message: "Registration successful",
        data: null,
        status: 201,
      });

      await submitPromise;
    });

    expect(result.current.isPending).toBe(false);
  });

  it("handles failed sign up response and still shows toast", async () => {
    const failedResponse = {
      isSuccess: false,
      message: "Email already exists",
      data: null,
      status: 409,
    };

    mockedSignUpAction.mockResolvedValue(failedResponse);

    const { result } = renderHook(() => useSignUp());

    const mockEvent = createMockSubmitEvent();

    await act(async () => {
      await result.current.handleFormSubmit(mockEvent);
    });

    expect(mockedSignUpAction).toHaveBeenCalledTimes(1);

    expect(mockHandleToast).toHaveBeenCalledWith(failedResponse, "/auth/login");

    expect(result.current.isPending).toBe(false);
  });

  it("passes validation errors and isFormValid from useAuthForm", () => {
    mockUseAuthFormReturn({
      validationErrors: {
        email: "Invalid email",
        password: "Password must be at least 8 characters",
      },
      isFormValid: false,
    });

    const { result } = renderHook(() => useSignUp());

    expect(result.current.validationErrors).toEqual({
      email: "Invalid email",
      password: "Password must be at least 8 characters",
    });

    expect(result.current.isFormValid).toBe(false);
  });
});
