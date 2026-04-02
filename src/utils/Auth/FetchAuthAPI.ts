import {
  AuthItem,
  AuthResponse,
  LoginDTO,
  RegisterDTO,
} from "@/types/auth.types";
import { DEFAULT_API_URL } from "@/lib/config";
import { ResponseError } from "./ResponseError";
import { IAdminLogin } from "@/types/admin.types";

export async function FetchAuthAPI(
  url: string,
  payload: LoginDTO | RegisterDTO | IAdminLogin,
): Promise<AuthResponse<AuthItem>> {
  let response;
  try {
    const res = await fetch(`${DEFAULT_API_URL}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    response = await res.json();

    if (!res.ok || !response.isSuccess) {
      throw new ResponseError(
        response.message || "Failed to authenticate",
        res.status,
      );
    }

    return response satisfies AuthResponse<AuthItem>;
  } catch (error) {
    if (error instanceof ResponseError) throw error;

    let message = error instanceof Error ? error.message : String(error);
    if (message.toLowerCase().includes("fetch")) {
      message = "Network error: Failed to connect to the server.";
    }

    throw new ResponseError(message, response?.status ?? 500);
  }
}
