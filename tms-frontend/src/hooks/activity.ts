import activityApi from "@components/api/activity";
import { useQuery } from "@tanstack/react-query";

const useGetActivities = ({ category }: { category?: string }) => {
  return useQuery({
    queryKey: ["activities"],
    queryFn: () => activityApi.getActivities({ category: category }),
    refetchOnWindowFocus: false,
  });
};

const useGetActivityById = (id: string) => {
  return useQuery({
    queryKey: ["activity", id],
    queryFn: () => activityApi.getActivityById(id),
    refetchOnWindowFocus: false,
  });
};

const useCreateActivity = (data: any) => {
  return useQuery({
    queryKey: ["activity"],
    queryFn: () => activityApi.createActivity(data),
    refetchOnWindowFocus: false,
  });
};

const useUpdateActivity = (id: string, data: any) => {
  return useQuery({
    queryKey: ["activity", id],
    queryFn: () => activityApi.updateActivity(id, data),
    refetchOnWindowFocus: false,
  });
};

const useDeleteActivity = (id: string) => {
  return useQuery({
    queryKey: ["activity", id],
    queryFn: () => activityApi.deleteActivity(id),
    refetchOnWindowFocus: false,
  });
};

export const activityQuery = {
  query: {
    useGetActivities,
    useGetActivityById,
    useCreateActivity,
    useUpdateActivity,
    useDeleteActivity,
  },
};
