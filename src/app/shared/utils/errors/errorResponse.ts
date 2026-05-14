import { safeErrorMessage } from "./safeMessage";

export class ErrorResponse extends Error {
  isSuccess: false;
  status: number;
  data: unknown;
  /** Original error detail — for server-side logging only, never shown to users. */
  rawMessage: string;

  constructor(rawMessage: string, status = 500, data: unknown = null) {
    const safe = safeErrorMessage(rawMessage, status);
    super(safe);
    this.name = "AppError";
    this.isSuccess = false;
    this.status = status;
    this.data = data;
    this.rawMessage = rawMessage;
  }
}
