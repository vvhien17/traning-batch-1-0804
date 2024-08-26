import axiosClient from "@components/axios-client";
import {
  TActivity,
  TCreateActivityRequest,
  TUpdateActivityRequest,
} from "@components/types/activity";
import { TBaseResponse } from "@components/types/types";

const activityApi = {
  getCategories: (): Promise<TBaseResponse<any>> =>
    axiosClient.get("/categories"),
  createCategory: (data: any): Promise<TBaseResponse<any>> =>
    axiosClient.post("/categories", data),
  getActivities: (params: {
    category?: string;
  }): Promise<TBaseResponse<TActivity[]>> =>
    axiosClient.get("/activity", {
      params,
    }),
  getActivityById: (id: string): Promise<TBaseResponse<any>> =>
    axiosClient.get(`/activities/${id}`),
  createActivity: (data: TCreateActivityRequest): Promise<TBaseResponse<any>> =>
    axiosClient.post("/activity", data),
  updateActivity: (data: TUpdateActivityRequest): Promise<TBaseResponse<any>> =>
    axiosClient.put(`/activity/${data.id}`, data),
  deleteActivity: (id: string): Promise<TBaseResponse<any>> =>
    axiosClient.delete(`/activity/${id}`),
};

export default activityApi;
