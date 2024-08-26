import axiosClient from "@components/axios-client";
import { TBaseResponse } from "@components/types/types";

const activityApi = {
  getCategories: (): Promise<TBaseResponse<any>> =>
    axiosClient.get("/categories"),
  createCategory: (data: any): Promise<TBaseResponse<any>> =>
    axiosClient.post("/categories", data),
  getActivities: (params: { category?: string }): Promise<TBaseResponse<any>> =>
    axiosClient.get("/activities", {
      params,
    }),
  getActivityById: (id: string): Promise<TBaseResponse<any>> =>
    axiosClient.get(`/activities/${id}`),
  createActivity: (data: any): Promise<TBaseResponse<any>> =>
    axiosClient.post("/activities", data),
  updateActivity: (id: string, data: any): Promise<TBaseResponse<any>> =>
    axiosClient.put(`/activities/${id}`, data),
  deleteActivity: (id: string): Promise<TBaseResponse<any>> =>
    axiosClient.delete(`/activities/${id}`),
};

export default activityApi;
