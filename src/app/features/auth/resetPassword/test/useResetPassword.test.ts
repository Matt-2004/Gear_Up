import { act, renderHook, waitFor } from "@testing-library/react";
import { useResetPassword } from "../hooks/useResetPassword";
import { useAuthForm } from "@/app/shared/hooks/useAuthForm";
import { useToast } from "@/app/features/toast/hooks/useToast";
import { resetPasswordAction } from "../utils/resetPasswordAction";

jest.mock("@/app/shared/hooks/useAuthForm", () => ({
  useAuthForm: jest.fn(),
}));

jest.mock("@/app/features/toast/hooks/useToast", () => ({
  useToast: jest.fn(),
}));

jest.mock("../utils/resetPasswordAction", () => ({
  resetPasswordAction: jest.fn(),
}));

const mockedUseAuthForm = useAuthForm as jest.Mock;
const mockedUseToast = useToast as jest.Mock;
const mockedResetPasswordAction = resetPasswordAction as jest.Mock;

const mockSetFormData = jest.fn();
const mockHandleToast = jest.fn();

const defaultFormData = {
  newPassword: "newPassword123",
  confirmedPassword: "newPassword123",
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

describe("useResetPassword", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseToast.mockReturnValue({
      handleToast: mockHandleToast,
    });

    mockUseAuthFormReturn();
  });

  it("returns initial hook values", () => {
    const { result } = renderHook(() => useResetPassword("valid-token"));

    expect(result.current.isPending).toBe(false);
    expect(result.current.formData).toEqual(defaultFormData);
    expect(result.current.setFormData).toBe(mockSetFormData);
    expect(result.current.validationErrors).toEqual({});
    expect(result.current.isFormValid).toBe(true);
    expect(typeof result.current.handleFormSubmit).toBe("function");
  });

  it("does not call resetPasswordAction when token is null", async () => {
    const { result } = renderHook(() => useResetPassword(null));

    const mockEvent = createMockSubmitEvent();

    await act(async () => {
      await result.current.handleFormSubmit(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);

    expect(mockedResetPasswordAction).not.toHaveBeenCalled();

    expect(mockHandleToast).toHaveBeenCalledWith(
      {
        isSuccess: false,
        message: "Reset token is missing or invalid.",
        data: null,
        status: 400,
      },
      "/auth/login",
    );

    expect(result.current.isPending).toBe(false);
  });

  it("does not call resetPasswordAction when token is empty after trim", async () => {
    const { result } = renderHook(() => useResetPassword("   "));

    const mockEvent = createMockSubmitEvent();

    await act(async () => {
      await result.current.handleFormSubmit(mockEvent);
    });

    expect(mockedResetPasswordAction).not.toHaveBeenCalled();

    expect(mockHandleToast).toHaveBeenCalledWith(
      {
        isSuccess: false,
        message: "Reset token is missing or invalid.",
        data: null,
        status: 400,
      },
      "/auth/login",
    );
  });

  it("submits reset password form data with normalized token", async () => {
    const successResponse = {
      isSuccess: true,
      message: "Password reset successful",
      data: null,
      status: 200,
    };

    mockedResetPasswordAction.mockResolvedValue(successResponse);

    const { result } = renderHook(() => useResetPassword("abc def ghi "));

    const mockEvent = createMockSubmitEvent();

    await act(async () => {
      await result.current.handleFormSubmit(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);

    expect(mockedResetPasswordAction).toHaveBeenCalledTimes(1);

    const submittedFormData = mockedResetPasswordAction.mock
      .calls[0][0] as FormData;

    expect(submittedFormData.get("newPassword")).toBe("newPassword123");
    expect(submittedFormData.get("confirmedPassword")).toBe("newPassword123");

    // Your hook replaces spaces with "+"
    expect(submittedFormData.get("token")).toBe("abc+def+ghi");

    expect(mockHandleToast).toHaveBeenCalledWith(
      successResponse,
      "/auth/login",
    );

    expect(result.current.isPending).toBe(false);
  });

  it("sets isPending to true while reset password request is running", async () => {
    let resolveResetPasswordAction!: (value: unknown) => void;

    const pendingPromise = new Promise((resolve) => {
      resolveResetPasswordAction = resolve;
    });

    mockedResetPasswordAction.mockReturnValue(pendingPromise);

    const { result } = renderHook(() => useResetPassword("valid-token"));

    const mockEvent = createMockSubmitEvent();

    let submitPromise!: Promise<void>;

    act(() => {
      submitPromise = result.current.handleFormSubmit(mockEvent);
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });

    await act(async () => {
      resolveResetPasswordAction({
        isSuccess: true,
        message: "Password reset successful",
        data: null,
        status: 200,
      });

      await submitPromise;
    });

    expect(result.current.isPending).toBe(false);
  });

  it("handles failed reset password response and still shows toast", async () => {
    const failedResponse = {
      isSuccess: false,
      message: "Reset token expired",
      data: null,
      status: 400,
    };

    mockedResetPasswordAction.mockResolvedValue(failedResponse);

    const { result } = renderHook(() => useResetPassword("expired-token"));

    const mockEvent = createMockSubmitEvent();

    await act(async () => {
      await result.current.handleFormSubmit(mockEvent);
    });

    expect(mockedResetPasswordAction).toHaveBeenCalledTimes(1);

    expect(mockHandleToast).toHaveBeenCalledWith(failedResponse, "/auth/login");

    expect(result.current.isPending).toBe(false);
  });

  it("passes validation errors and isFormValid from useAuthForm", () => {
    mockUseAuthFormReturn({
      validationErrors: {
        newPassword: "Password must be at least 8 characters",
        confirmedPassword: "Passwords do not match",
      },
      isFormValid: false,
    });

    const { result } = renderHook(() => useResetPassword("valid-token"));

    expect(result.current.validationErrors).toEqual({
      newPassword: "Password must be at least 8 characters",
      confirmedPassword: "Passwords do not match",
    });

    expect(result.current.isFormValid).toBe(false);
  });
});
