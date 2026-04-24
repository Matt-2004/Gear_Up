export class ErrorResponse extends Error {
  isSuccess: false;
  status: number;
  data: unknown;

  constructor(message: string, status = 500, data: unknown = null) {
    super(message);
    this.name = "AppError";
    this.isSuccess = false;
    this.status = status;
    this.data = data;
  }
}
