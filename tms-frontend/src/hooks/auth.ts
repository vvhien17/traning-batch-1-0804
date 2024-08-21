import { useMutation } from "@tanstack/react-query";
import {
  TLoginRequest,
  TLoginResponse,
  TRegisterRequest,
} from "@components/types/auth";
import axiosClient from "@components/axios-client";
import { TBaseResponse } from "@components/types/types";

const api = {
  login: (data: TLoginRequest): Promise<TBaseResponse<TLoginResponse>> =>
    axiosClient.post("/user/login", data),
  register: (data: TRegisterRequest): Promise<TBaseResponse<null>> =>
    axiosClient.post("/user/register", data),
};

const useLogin = () => {
  return useMutation<TBaseResponse<TLoginResponse>, Error, TLoginRequest>({
    mutationFn: api.login,
  });
};

const useRegister = () => {
  return useMutation({
    mutationFn: api.register,
  });
};

export const authQuery = {
  mutation: {
    useLogin,
    useRegister,
  },
};
