import { useMutation, useQuery } from "@tanstack/react-query";

import { createGoalQuery, getGoalQuery } from "./queryFns";
import { QueryKeysGoal } from "./queryKeys";

export const useGetGoal = () => {
  return useQuery({
    queryFn: () => getGoalQuery(),
    queryKey: [QueryKeysGoal.GOAL],
  });
};

export const useCreateGoal = () => {
  return useMutation({
    mutationFn: createGoalQuery,
    mutationKey: [QueryKeysGoal.CREATE_GOAL],
  });
};
