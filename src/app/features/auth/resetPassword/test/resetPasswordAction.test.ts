import { resetPasswordAction } from "../utils/resetPasswordAction";
import { postFetch } from "@/app/shared/utils/API/AxiosClient";

jest.mock("@/app/shared/utils/API/AxiosClient", () => ({
  postFetch: jest.fn(),
}));

const mockedPostFetch = postFetch as jest.MockedFunction<typeof postFetch>;

function createResetPasswordFormData() {
  const formData = new FormData();

  formData.append("newPassword", "newPassword123");
  formData.append("confirmedPassword", "newPassword123");
  formData.append("token", "reset-token-123");

  return formData;
}

describe("resetPasswordAction", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls reset password API with correct token and payload", async () => {
    mockedPostFetch.mockResolvedValue({
      isSuccess: true,
      message: "Password reset successful",
      data: null,
      status: 200,
    });

    await resetPasswordAction(createResetPasswordFormData());

    expect(mockedPostFetch).toHaveBeenCalledTimes(1);

    expect(mockedPostFetch).toHaveBeenCalledWith(
      "/api/v1/auth/reset-password?token=reset-token-123",
      {
        newPassword: "newPassword123",
        confirmedPassword: "newPassword123",
      },
    );
  });

  it("returns success response from postFetch", async () => {
    const successResponse = {
      isSuccess: true,
      message: "Password reset successful",
      data: null,
      status: 200,
    };

    mockedPostFetch.mockResolvedValue(successResponse);

    const result = await resetPasswordAction(createResetPasswordFormData());

    expect(result).toEqual(successResponse);
  });

  it("returns failed response when postFetch throws error with message and status", async () => {
    mockedPostFetch.mockRejectedValue({
      message: "Reset token expired",
      status: 400,
    });

    const result = await resetPasswordAction(createResetPasswordFormData());

    expect(result).toEqual({
      isSuccess: false,
      message: "Reset token expired",
      data: null,
      status: 400,
    });
  });

  it("returns default failed response when postFetch throws unknown error", async () => {
    mockedPostFetch.mockRejectedValue({});

    const result = await resetPasswordAction(createResetPasswordFormData());

    expect(result).toEqual({
      isSuccess: false,
      message: "An error occurred while validating email.",
      data: null,
      status: 500,
    });
  });

  it("uses confirmedPassword from FormData as confirmedPassword in payload", async () => {
    mockedPostFetch.mockResolvedValue({
      isSuccess: true,
      message: "Password reset successful",
      data: null,
      status: 200,
    });

    const formData = new FormData();
    formData.append("newPassword", "abc123456");
    formData.append("confirmedPassword", "abc123456-confirmed");
    formData.append("token", "token-abc");

    await resetPasswordAction(formData);

    expect(mockedPostFetch).toHaveBeenCalledWith(
      "/api/v1/auth/reset-password?token=token-abc",
      {
        newPassword: "abc123456",
        confirmedPassword: "abc123456-confirmed",
      },
    );
  });
});
