import dashboardApi from "@components/api/dashboard";
import { useQuery } from "@tanstack/react-query";

const useGetDashboard = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboardApi.getDashboard,
  });
};

export const dashboardQuery = {
  query: {
    useGetDashboard,
  },
};
