export interface MainResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
  status: number;
}
