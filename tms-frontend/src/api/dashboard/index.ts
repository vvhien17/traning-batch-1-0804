import axiosClient from "@components/axios-client";
import { TBaseResponse } from "@components/types/types";

const dashboardApi = {
  getDashboard: (): Promise<
    TBaseResponse<
      {
        categoryId: string;
        name: string;
        percentage: number;
      }[]
    >
  > => axiosClient.get("/dashboard"),

  getSummaryTime: (
    option: "day" | "week"
  ): Promise<
    TBaseResponse<{
      totalHours: number;
      totalMinutes: number;
    }>
  > => axiosClient.get(`/dashboard/summary-time/${option}`),
};

export default dashboardApi;
