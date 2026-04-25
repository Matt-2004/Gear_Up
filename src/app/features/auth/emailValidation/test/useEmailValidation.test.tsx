import { act, renderHook, waitFor } from "@testing-library/react";
import { useEmailValidation } from "../hooks/useEmailValidation";
import { useAuthForm } from "@/app/shared/hooks/useAuthForm";
import { useToast } from "@/app/features/toast/hooks/useToast";
import { emailValidationAction } from "../utils/emailValidationAction";

jest.mock("@/app/shared/hooks/useAuthForm", () => ({
  useAuthForm: jest.fn(),
}));

jest.mock("@/app/features/toast/hooks/useToast", () => ({
  useToast: jest.fn(),
}));

jest.mock("../utils/emailValidationAction", () => ({
  emailValidationAction: jest.fn(),
}));

const mockedUseAuthForm = useAuthForm as jest.Mock;
const mockedUseToast = useToast as jest.Mock;
const mockedEmailValidationAction = emailValidationAction as jest.Mock;

const mockSetFormData = jest.fn();
const mockHandleToast = jest.fn();

const defaultFormData = {
  email: "matt@example.com",
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

describe("useEmailValidation", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseToast.mockReturnValue({
      handleToast: mockHandleToast,
    });

    mockUseAuthFormReturn();
  });

  it("returns initial hook values", () => {
    const { result } = renderHook(() => useEmailValidation("reset-password"));

    expect(result.current.isPending).toBe(false);
    expect(result.current.formData).toEqual(defaultFormData);
    expect(result.current.setFormData).toBe(mockSetFormData);
    expect(result.current.validationErrors).toEqual({});
    expect(result.current.isFormValid).toBe(true);
    expect(typeof result.current.handleFormSubmit).toBe("function");
  });

  it("submits email form data correctly", async () => {
    const successResponse = {
      isSuccess: true,
      message: "Reset link sent",
      data: null,
      status: 200,
    };

    mockedEmailValidationAction.mockResolvedValue(successResponse);

    const { result } = renderHook(() => useEmailValidation("reset-password"));

    const mockEvent = createMockSubmitEvent();

    await act(async () => {
      await result.current.handleFormSubmit(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
    expect(mockedEmailValidationAction).toHaveBeenCalledTimes(1);

    const submittedFormData = mockedEmailValidationAction.mock
      .calls[0][0] as FormData;

    expect(submittedFormData.get("email")).toBe("matt@example.com");

    expect(mockHandleToast).toHaveBeenCalledWith(
      successResponse,
      "/auth/login",
    );

    expect(result.current.isPending).toBe(false);
  });

  it("sets isPending to true while email validation request is running", async () => {
    let resolveEmailValidationAction!: (value: unknown) => void;

    const pendingPromise = new Promise((resolve) => {
      resolveEmailValidationAction = resolve;
    });

    mockedEmailValidationAction.mockReturnValue(pendingPromise);

    const { result } = renderHook(() => useEmailValidation("reset-password"));

    const mockEvent = createMockSubmitEvent();

    let submitPromise!: Promise<void>;

    act(() => {
      submitPromise = result.current.handleFormSubmit(mockEvent);
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });

    await act(async () => {
      resolveEmailValidationAction({
        isSuccess: true,
        message: "Reset link sent",
        data: null,
        status: 200,
      });

      await submitPromise;
    });

    expect(result.current.isPending).toBe(false);
  });

  it("handles failed response and still shows toast", async () => {
    const failedResponse = {
      isSuccess: false,
      message: "Email not found",
      data: null,
      status: 404,
    };

    mockedEmailValidationAction.mockResolvedValue(failedResponse);

    const { result } = renderHook(() => useEmailValidation("reset-password"));

    const mockEvent = createMockSubmitEvent();

    await act(async () => {
      await result.current.handleFormSubmit(mockEvent);
    });

    expect(mockedEmailValidationAction).toHaveBeenCalledTimes(1);

    expect(mockHandleToast).toHaveBeenCalledWith(failedResponse, "/auth/login");

    expect(result.current.isPending).toBe(false);
  });

  it("passes validation errors and isFormValid from useAuthForm", () => {
    mockUseAuthFormReturn({
      validationErrors: {
        email: "Invalid email",
      },
      isFormValid: false,
    });

    const { result } = renderHook(() => useEmailValidation("reset-password"));

    expect(result.current.validationErrors).toEqual({
      email: "Invalid email",
    });

    expect(result.current.isFormValid).toBe(false);
  });
});
