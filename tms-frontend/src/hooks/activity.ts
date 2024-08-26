import activityApi from "@components/api/activity";
import {
  TCreateActivityRequest,
  TUpdateActivityRequest,
} from "@components/types/activity";
import { TBaseResponse } from "@components/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const useGetCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => activityApi.getCategories(),
  });
};

const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<TBaseResponse<any>, Error, { name: string }>({
    mutationFn: activityApi.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

const useGetActivities = ({ category }: { category?: string }) => {
  return useQuery({
    queryKey: ["activities"],
    queryFn: () => activityApi.getActivities({ category: category }),
    refetchOnWindowFocus: false,
  });
};

const useGetActivityById = (id: string) => {
  return useQuery({
    queryKey: ["activities", id],
    queryFn: () => activityApi.getActivityById(id),
    refetchOnWindowFocus: false,
  });
};

const useCreateActivity = () => {
  const queryClient = useQueryClient();
  return useMutation<TBaseResponse<any>, Error, TCreateActivityRequest>({
    mutationFn: activityApi.createActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });
};

const useUpdateActivity = () => {
  const queryClient = useQueryClient();
  return useMutation<TBaseResponse<any>, Error, TUpdateActivityRequest>({
    mutationFn: activityApi.updateActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });
};

const useDeleteActivity = (id: string) => {
  return useMutation<TBaseResponse<any>, Error, TCreateActivityRequest>({
    mutationFn: () => activityApi.deleteActivity(id),
  });
};

export const activityQuery = {
  query: {
    useGetCategories,
    useGetActivities,
    useGetActivityById,
  },
  mutation: {
    useCreateActivity,
    useUpdateActivity,
    useDeleteActivity,
    useCreateCategory,
  },
};
