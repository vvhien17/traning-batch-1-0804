export type TBaseResponse<T> = {
  isSuccess: boolean;
  message: string;
  data: T;
};
