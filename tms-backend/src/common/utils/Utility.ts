import { BaseResponse } from '../base-response/base-response.dto';

export const buildError = (message: string): BaseResponse => {
  return {
    data: null,
    isSuccess: false,
    message: message,
  };
};
