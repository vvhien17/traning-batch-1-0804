import axiosClient from "@components/axios-client";
import {
  TCreateGoalRequest,
  TCreateGoalResponse,
  TGoalOnActivitiesRequest,
  TItemActivitiesOnGoal,
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

  getActivitiesOnGoal: (
    id: number
  ): Promise<TBaseResponse<Array<TItemActivitiesOnGoal>>> =>
    axiosClient.get(`/goal-on-activity/${id}`),

  addActivityOnGoal: (
    data: TGoalOnActivitiesRequest
  ): Promise<TBaseResponse<TCreateGoalResponse>> =>
    axiosClient.post("/goal-on-activity", data),

  deleteActivityOnGoal: (
    data: TGoalOnActivitiesRequest
  ): Promise<TBaseResponse<TCreateGoalResponse>> =>
    axiosClient.delete("/goal-on-activity", { data }),

  getCanAddToGoal: (
    id: number
  ): Promise<TBaseResponse<Array<TItemActivitiesOnGoal>>> =>
    axiosClient.get(`activity/can-add-to-goal/${id}`),
};
