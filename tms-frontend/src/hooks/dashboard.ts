import dashboardApi from "@components/api/dashboard";
import { useQuery } from "@tanstack/react-query";

const useGetDashboard = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboardApi.getDashboard,
  });
};

const useGetSummaryTime = (option: "day" | "week") => {
  return useQuery({
    queryKey: ["summary-time", option],
    queryFn: () => dashboardApi.getSummaryTime(option),
  });
};

export const dashboardQuery = {
  query: {
    useGetDashboard,
    useGetSummaryTime,
  },
};
