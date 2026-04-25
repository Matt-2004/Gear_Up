import { signUpAction } from "../utils/signUpAction";
import { postFetch } from "@/app/shared/utils/API/AxiosClient";

jest.mock("@/app/shared/utils/API/AxiosClient", () => ({
  postFetch: jest.fn(),
}));

const mockedPostFetch = postFetch as jest.Mock;

function createRegisterFormData() {
  const formData = new FormData();

  formData.append("username", "matt_dev");
  formData.append("email", "matt@example.com");
  formData.append("firstName", "Matt");
  formData.append("lastName", "Dev");
  formData.append("password", "password123");
  formData.append("confirmPassword", "password123");

  return formData;
}

describe("signUpAction", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls register API with correct payload", async () => {
    mockedPostFetch.mockResolvedValue({
      isSuccess: true,
      message: "Created",
      data: null,
      status: 201,
    });

    const formData = createRegisterFormData();

    await signUpAction(formData);

    expect(mockedPostFetch).toHaveBeenCalledTimes(1);

    expect(mockedPostFetch).toHaveBeenCalledWith("/api/v1/auth/register", {
      username: "matt_dev",
      email: "matt@example.com",
      firstName: "Matt",
      lastName: "Dev",
      password: "password123",
      confirmPassword: "password123",
    });
  });

  it("returns custom success message when registration status is 201", async () => {
    mockedPostFetch.mockResolvedValue({
      isSuccess: true,
      message: "Created",
      data: null,
      status: 201,
    });

    const result = await signUpAction(createRegisterFormData());

    expect(result).toEqual({
      isSuccess: true,
      message: "Registration successful, check your email for verification.",
      data: null,
      status: 201,
    });
  });

  it("returns original response when status is not 201", async () => {
    const apiResponse = {
      isSuccess: false,
      message: "Email already exists",
      data: null,
      status: 409,
    };

    mockedPostFetch.mockResolvedValue(apiResponse);

    const result = await signUpAction(createRegisterFormData());

    expect(result).toEqual(apiResponse);
  });

  it("returns failed response when postFetch throws an error with message and status", async () => {
    mockedPostFetch.mockRejectedValue({
      message: "Network error",
      status: 503,
    });

    const result = await signUpAction(createRegisterFormData());

    expect(result).toEqual({
      isSuccess: false,
      message: "Network error",
      data: null,
      status: 503,
    });
  });

  it("returns default failed response when postFetch throws unknown error", async () => {
    mockedPostFetch.mockRejectedValue({});

    const result = await signUpAction(createRegisterFormData());

    expect(result).toEqual({
      isSuccess: false,
      message: "Registration failed",
      data: null,
      status: 500,
    });
  });
});
