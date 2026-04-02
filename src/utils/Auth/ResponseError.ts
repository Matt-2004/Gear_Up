import { MainResponse } from "@/types/data.types";

export class ResponseError extends Error implements MainResponse<null> {
  isSuccess: boolean;
  data: null = null;
  message: string;
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.isSuccess = false;
    this.message = message;
    this.status = status;
  }
}
