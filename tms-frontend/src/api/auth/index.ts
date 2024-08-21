import axiosClient from "@components/axios-client";
import {
  TLoginRequest,
  TLoginResponse,
  TRegisterRequest,
} from "@components/types/auth";
import { TBaseResponse } from "@components/types/types";

const authApi = {
  login: (data: TLoginRequest): Promise<TBaseResponse<TLoginResponse>> =>
    axiosClient.post("/auth/login", data),
  register: (data: TRegisterRequest): Promise<TBaseResponse<null>> =>
    axiosClient.post("/users/register", data),
};

export default authApi;
