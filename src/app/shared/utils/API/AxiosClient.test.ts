import { AxiosError } from "axios";
import { normalizeError } from "./axios-error";

describe("normalizeError", () => {
  it("prefers HTTP response status over payload status", () => {
    const error = new AxiosError("Server error");
    (error as AxiosError).response = {
      status: 500,
      data: { status: 404, message: "Not Found" },
      statusText: "Internal Server Error",
      headers: {},
      config: {},
    } as never;

    const result = normalizeError(error, "GET /test");

    expect(result.status).toBe(500);
    expect(result.message).toBe("Not Found");
  });

  it("falls back to payload status when response status missing", () => {
    const error = new AxiosError("Payload status");
    (error as AxiosError).response = {
      data: { status: 422, message: "Validation error" },
      statusText: "",
      headers: {},
      config: {},
    } as never;

    const result = normalizeError(error, "POST /test");

    expect(result.status).toBe(422);
    expect(result.message).toBe("Validation error");
  });

  it("handles non-axios errors", () => {
    const result = normalizeError(new Error("boom"), "PATCH /test");

    expect(result.status).toBe(500);
    expect(result.message).toBe("boom");
  });
});
