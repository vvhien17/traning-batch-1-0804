import authApi from "@components/api/auth";
import { TLoginRequest, TLoginResponse } from "@components/types/auth";
import { TBaseResponse } from "@components/types/types";
import { useMutation } from "@tanstack/react-query";

const useLogin = () => {
  return useMutation<TBaseResponse<TLoginResponse>, Error, TLoginRequest>({
    mutationFn: authApi.login,
  });
};

const useRegister = () => {
  return useMutation({
    mutationFn: authApi.register,
  });
};

export const authQuery = {
  mutation: {
    useLogin,
    useRegister,
  },
};
