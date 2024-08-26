import axiosClient from "@components/axios-client";
import {
  TCreateGoalRequest,
  TCreateGoalResponse,
  TItemGoal,
} from "@components/types/goal";
import { TBaseResponse } from "@components/types/types";

export const goalApi = {
  getGoal: (): Promise<TBaseResponse<Array<TItemGoal>>> =>
    axiosClient.get("/goal"),

  createGoal: (
    data: TCreateGoalRequest
  ): Promise<TBaseResponse<TCreateGoalResponse>> =>
    axiosClient.post("/goal", data),
};
