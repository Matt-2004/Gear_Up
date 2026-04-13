import { MainResponse } from "@/types/data.types";

interface ResponseErrorOptions {
  data?: unknown;
  response?: unknown;
  error?: unknown;
  cause?: unknown;
}

export class ResponseError extends Error implements MainResponse<null> {
  isSuccess: boolean;
  data: null = null;
  message: string;
  status: number;
  response?: unknown;
  error?: unknown;

  constructor(message: string, status: number, options?: ResponseErrorOptions) {
    super(message);

    this.name = "ResponseError";
    this.isSuccess = false;
    this.message = message;
    this.status = status;
    this.response = options?.response;
    this.error = options?.error;

    if (options && "data" in options && options.data !== undefined) {
      this.data = options.data as null;
    }

    if (options?.cause !== undefined) {
      this.cause = options.cause;
    }
  }
}
