import { goalApi } from "@components/api/goal";
import { TCreateGoalRequest } from "@components/types/goal";

export const getGoalQuery = async () => {
  const data = await goalApi.getGoal();

  return data.data;
};

export const createGoalQuery = async (query: TCreateGoalRequest) => {
  const data = await goalApi.createGoal(query);

  return data;
};
