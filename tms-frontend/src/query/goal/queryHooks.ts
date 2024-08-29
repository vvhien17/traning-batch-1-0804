import { useMutation, useQuery } from "@tanstack/react-query";

import {
  addActivityOnGoalQuery,
  createGoalQuery,
  deleteActivityOnGoalQuery,
  getActivityOnGoalQuery,
  getCanAddToGoalQuery,
  getGoalQuery,
} from "./queryFns";
import { QueryKeysGoal } from "./queryKeys";

export const useGetGoal = () => {
  return useQuery({
    queryFn: () => getGoalQuery(),
    queryKey: [QueryKeysGoal.GOAL],
  });
};

export const useGetActivityOnGoal = (id: number) => {
  return useQuery({
    queryFn: () => getActivityOnGoalQuery(id),
    queryKey: [QueryKeysGoal.ACTIVITY_ON_GOAL],
  });
};

export const useGetCanAddToGoal = (id: number) => {
  return useQuery({
    queryFn: () => getCanAddToGoalQuery(id),
    queryKey: [QueryKeysGoal.CAN_ADD_TO_GOAL],
  });
};

export const useCreateGoal = () => {
  return useMutation({
    mutationFn: createGoalQuery,
    mutationKey: [QueryKeysGoal.CREATE_GOAL],
  });
};

export const useAddActivityOnGoal = () => {
  return useMutation({
    mutationFn: addActivityOnGoalQuery,
    mutationKey: [QueryKeysGoal.ADD_ACTIVITY_ON_GOAL],
  });
};

export const useDeleteActivityOnGoal = () => {
  return useMutation({
    mutationFn: deleteActivityOnGoalQuery,
    mutationKey: [QueryKeysGoal.DELETE_ACTIVITY_ON_GOAL],
  });
};
