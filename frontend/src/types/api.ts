export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiErrorPayload {
  success: false;
  message: string;
  data: unknown;
}
