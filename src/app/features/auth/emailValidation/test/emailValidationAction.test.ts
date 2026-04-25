import { emailValidationAction } from "../utils/emailValidationAction";
import { postFetch } from "@/app/shared/utils/API/AxiosClient";

jest.mock("@/app/shared/utils/API/AxiosClient", () => ({
  postFetch: jest.fn(),
}));

const mockedPostFetch = postFetch as jest.MockedFunction<typeof postFetch>;

function createEmailValidationFormData(email = "matt@example.com") {
  const formData = new FormData();
  formData.append("email", email);
  return formData;
}

describe("emailValidationAction", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls email validation API with correct email and payload", async () => {
    mockedPostFetch.mockResolvedValue({
      isSuccess: true,
      message: "Email sent successfully",
      data: null,
      status: 200,
    });

    await emailValidationAction(createEmailValidationFormData());

    expect(mockedPostFetch).toHaveBeenCalledTimes(1);

    expect(mockedPostFetch).toHaveBeenCalledWith(
      "/api/v1/auth/send-password-reset-token?email=matt@example.com",
      {
        email: "matt@example.com",
      },
    );
  });

  it("returns success response from postFetch", async () => {
    const successResponse = {
      isSuccess: true,
      message: "Email sent successfully",
      data: null,
      status: 200,
    };

    mockedPostFetch.mockResolvedValue(successResponse);

    const result = await emailValidationAction(createEmailValidationFormData());

    expect(result).toEqual(successResponse);
  });

  it("returns failed response when postFetch throws error with message and status", async () => {
    mockedPostFetch.mockRejectedValue({
      message: "Email not found",
      status: 404,
    });

    const result = await emailValidationAction(createEmailValidationFormData());

    expect(result).toEqual({
      isSuccess: false,
      message: "Email not found",
      data: null,
      status: 404,
    });
  });

  it("returns default failed response when postFetch throws unknown error", async () => {
    mockedPostFetch.mockRejectedValue({});

    const result = await emailValidationAction(createEmailValidationFormData());

    expect(result).toEqual({
      isSuccess: false,
      message: "An error occurred while validating email.",
      data: null,
      status: 500,
    });
  });
});
