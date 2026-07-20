// Shared API response types (placeholder).
export type ApiSuccess<T> = {
  success: true;
  data: T;
  error: null;
};

export type ApiFailure = {
  success: false;
  data: null;
  error: { code: number; message: string };
};
