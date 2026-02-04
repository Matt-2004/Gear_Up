interface DefaultResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T[];
  status: number;
}
