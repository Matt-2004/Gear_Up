// signInAction.test.ts
import { signInAction } from "../utils/signInAction";
import { postFetch } from "@/app/shared/utils/API/AxiosClient";

jest.mock("@/app/shared/utils/API/AxiosClient", () => ({
  postFetch: jest.fn(),
}));

const mockedPostFetch = postFetch as jest.MockedFunction<typeof postFetch>;

function createSignInFormData() {
  const formData = new FormData();
  formData.append("usernameOrEmail", "matt@example.com");
  formData.append("password", "password123");
  return formData;
}

describe("signInAction", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns success response when login succeeds", async () => {
    const successResponse = {
      isSuccess: true,
      message: "Login successful",
      data: {
        accessToken: "access-token",
        refreshToken: "refresh-token",
      },
      status: 200,
    };

    mockedPostFetch.mockResolvedValueOnce(successResponse);

    const result = await signInAction(createSignInFormData());

    expect(mockedPostFetch).toHaveBeenCalledTimes(1);

    expect(mockedPostFetch).toHaveBeenCalledWith("/api/v1/auth/login", {
      usernameOrEmail: "matt@example.com",
      password: "password123",
    });

    expect(result).toEqual(successResponse);
  });

  it("resends verification email when login fails with 403 and resend succeeds", async () => {
    mockedPostFetch
      .mockRejectedValueOnce({
        isSuccess: false,
        message: "Email not verified",
        data: null,
        status: 403,
      })
      .mockResolvedValueOnce({
        isSuccess: true,
        message: "Verification email sent",
        data: null,
        status: 200,
      });

    const result = await signInAction(createSignInFormData());

    expect(mockedPostFetch).toHaveBeenCalledTimes(2);

    expect(mockedPostFetch).toHaveBeenNthCalledWith(1, "/api/v1/auth/login", {
      usernameOrEmail: "matt@example.com",
      password: "password123",
    });

    expect(mockedPostFetch).toHaveBeenNthCalledWith(
      2,
      "/api/v1/auth/resend-verification-email?email=matt@example.com",
      null,
    );

    expect(result).toEqual({
      isSuccess: false,
      message:
        "Your email is not verified. Please check your email for the verification link.",
      data: null,
      status: 403,
    });
  });

  it("returns resend response when login fails with 403 and resend also fails", async () => {
    const resendFailedResponse = {
      isSuccess: false,
      message: "Failed to resend verification email",
      data: null,
      status: 400,
    };

    mockedPostFetch
      .mockRejectedValueOnce({
        isSuccess: false,
        message: "Email not verified",
        data: null,
        status: 403,
      })
      .mockResolvedValueOnce(resendFailedResponse);

    const result = await signInAction(createSignInFormData());

    expect(mockedPostFetch).toHaveBeenCalledTimes(2);

    expect(result).toEqual(resendFailedResponse);
  });

  it("returns fallback error response when login fails with normal error", async () => {
    mockedPostFetch.mockRejectedValueOnce({
      isSuccess: false,
      message: "Invalid email or password",
      data: null,
      status: 401,
    });

    const result = await signInAction(createSignInFormData());

    expect(mockedPostFetch).toHaveBeenCalledTimes(1);

    expect(result).toEqual({
      isSuccess: false,
      message: "Invalid email or password",
      data: null,
      status: 401,
    });
  });

  it("returns default error response when error has no message or status", async () => {
    mockedPostFetch.mockRejectedValueOnce({});

    const result = await signInAction(createSignInFormData());

    expect(result).toEqual({
      isSuccess: false,
      message: "Sign-in failed",
      data: null,
      status: 500,
    });
  });
});
