import { act, renderHook, waitFor } from "@testing-library/react";
import { useSignIn } from "../hooks/useSignIn";
import { signInAction } from "../utils/signInAction";
import {
  token_integration,
  user_data_integration,
} from "@/app/shared/utils/AuthUtils/CookieIntegration";
import { UserFetch } from "@/app/shared/utils/AuthUtils/UserFetch";
import { encrypt } from "@/app/shared/utils/AuthUtils/encryption";
import { useToast } from "@/app/features/toast/hooks/useToast";
import { useUserData } from "@/app/features/navbar/context/UserDataContext";

jest.mock("../utils/signInAction", () => ({
  signInAction: jest.fn(),
}));

jest.mock("@/app/shared/utils/AuthUtils/CookieIntegration", () => ({
  token_integration: jest.fn(),
  user_data_integration: jest.fn(),
}));

jest.mock("@/app/shared/utils/AuthUtils/UserFetch", () => ({
  UserFetch: jest.fn(),
}));

jest.mock("@/app/shared/utils/AuthUtils/encryption", () => ({
  encrypt: jest.fn(),
}));

jest.mock("@/app/features/toast/hooks/useToast", () => ({
  useToast: jest.fn(),
}));

jest.mock("@/app/features/navbar/context/UserDataContext", () => ({
  useUserData: jest.fn(),
}));

const mockedSignInAction = signInAction as jest.Mock;
const mockedTokenIntegration = token_integration as jest.Mock;
const mockedUserDataIntegration = user_data_integration as jest.Mock;
const mockedUserFetch = UserFetch as jest.Mock;
const mockedEncrypt = encrypt as jest.Mock;
const mockedUseToast = useToast as jest.Mock;
const mockedUseUserData = useUserData as jest.Mock;

describe("useSignIn", () => {
  const mockHandleToast = jest.fn();
  const mockRefreshUserData = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseToast.mockReturnValue({
      handleToast: mockHandleToast,
    });

    mockedUseUserData.mockReturnValue({
      refreshUserData: mockRefreshUserData,
    });
  });

  it("returns initial form data and pending state", () => {
    const { result } = renderHook(() => useSignIn());

    expect(result.current.isPending).toBe(false);

    expect(result.current.formData).toEqual({
      usernameOrEmail: "",
      password: "",
      rememberMe: false,
    });
  });

  it("updates form data using setFormData", async () => {
    const { result } = renderHook(() => useSignIn());

    act(() => {
      result.current.setFormData({
        usernameOrEmail: "test@gmail.com",
        password: "password123",
        rememberMe: true,
      });
    });

    expect(result.current.formData).toEqual({
      usernameOrEmail: "test@gmail.com",
      password: "password123",
      rememberMe: true,
    });
  });

  it("submits login form successfully", async () => {
    mockedSignInAction.mockResolvedValue({
      isSuccess: true,
      message: "Login successful",
      data: {
        access_token: "access-token",
        refresh_token: "refresh-token",
      },
      status: 200,
    });

    mockedUserFetch.mockResolvedValue({
      isSuccess: true,
      message: "User fetched",
      data: {
        id: "user-1",
        name: "John Doe",
      },
      status: 200,
    });

    mockedEncrypt.mockResolvedValue("encrypted-user-data");

    const { result } = renderHook(() => useSignIn());

    act(() => {
      result.current.setFormData({
        usernameOrEmail: "test@gmail.com",
        password: "password123",
        rememberMe: true,
      });
    });

    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.FormEvent<HTMLFormElement>;

    await act(async () => {
      await result.current.handleFormSubmit(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();

    expect(mockedSignInAction).toHaveBeenCalledTimes(1);

    const submittedFormData = mockedSignInAction.mock.calls[0][0] as FormData;

    expect(submittedFormData.get("usernameOrEmail")).toBe("test@gmail.com");
    expect(submittedFormData.get("password")).toBe("password123");

    expect(mockedTokenIntegration).toHaveBeenCalledWith(
      {
        access_token: "access-token",
        refresh_token: "refresh-token",
      },
      true,
    );

    expect(mockedUserFetch).toHaveBeenCalledTimes(1);

    expect(mockedEncrypt).toHaveBeenCalledWith({
      id: "user-1",
      name: "John Doe",
    });

    expect(mockedUserDataIntegration).toHaveBeenCalledWith(
      "encrypted-user-data",
      true,
    );

    expect(mockRefreshUserData).toHaveBeenCalledTimes(1);

    expect(mockHandleToast).toHaveBeenCalledWith(
      {
        isSuccess: true,
        message: "Login successful",
        data: {
          access_token: "access-token",
          refresh_token: "refresh-token",
        },
        status: 200,
      },
      "/",
    );

    expect(result.current.isPending).toBe(false);
  });

  it("does not save token or user data when login fails", async () => {
    mockedSignInAction.mockResolvedValue({
      isSuccess: false,
      message: "Invalid credentials",
      data: null,
      status: 401,
    });

    const { result } = renderHook(() => useSignIn());

    act(() => {
      result.current.setFormData({
        usernameOrEmail: "wrong@gmail.com",
        password: "wrongpassword",
        rememberMe: false,
      });
    });

    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.FormEvent<HTMLFormElement>;

    await act(async () => {
      await result.current.handleFormSubmit(mockEvent);
    });

    expect(mockedSignInAction).toHaveBeenCalledTimes(1);

    expect(mockedTokenIntegration).not.toHaveBeenCalled();
    expect(mockedUserFetch).not.toHaveBeenCalled();
    expect(mockedEncrypt).not.toHaveBeenCalled();
    expect(mockedUserDataIntegration).not.toHaveBeenCalled();
    expect(mockRefreshUserData).not.toHaveBeenCalled();

    expect(mockHandleToast).toHaveBeenCalledWith(
      {
        isSuccess: false,
        message: "Invalid credentials",
        data: null,
        status: 401,
      },
      "/",
    );

    expect(result.current.isPending).toBe(false);
  });

  it("sets isPending to true while submit is running", async () => {
    let resolveSignInAction: (value: unknown) => void;

    mockedSignInAction.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSignInAction = resolve;
        }),
    );

    const { result } = renderHook(() => useSignIn());

    act(() => {
      result.current.setFormData({
        usernameOrEmail: "test@gmail.com",
        password: "password123",
        rememberMe: false,
      });
    });

    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.FormEvent<HTMLFormElement>;

    act(() => {
      result.current.handleFormSubmit(mockEvent);
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });

    await act(async () => {
      resolveSignInAction!({
        isSuccess: false,
        message: "Invalid credentials",
        data: null,
        status: 401,
      });
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });
  });
});
