// app/shared/utils/errors/handleServerError.ts

import { forbidden, notFound, unauthorized } from "next/navigation";
import { ErrorResponse } from "@/app/shared/utils/errors/errorResponse";

export function handleServerError(error: unknown): ErrorResponse {
  if (error instanceof ErrorResponse) {
    switch (error.status) {
      case 401:
        unauthorized();

      case 404:
        notFound();

      case 500:
        return new ErrorResponse(error.message, 500);

      case 403:
        forbidden();

      default:
        return new ErrorResponse(
          error.message || "We could not complete your request.",
          error.status,
        );
    }
  }

  throw error;
}
