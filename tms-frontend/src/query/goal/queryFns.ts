import { goalApi } from "@components/api/goal";
import {
  TCreateGoalRequest,
  TGoalOnActivitiesRequest,
} from "@components/types/goal";

export const getGoalQuery = async () => {
  const data = await goalApi.getGoal();

  return data.data;
};

export const createGoalQuery = async (query: TCreateGoalRequest) => {
  const data = await goalApi.createGoal(query);

  return data;
};

export const getActivityOnGoalQuery = async (id: number) => {
  const data = await goalApi.getActivitiesOnGoal(id);

  return data.data;
};

export const getCanAddToGoalQuery = async (id: number) => {
  const data = await goalApi.getCanAddToGoal(id);

  return data.data;
};

export const addActivityOnGoalQuery = async (
  query: TGoalOnActivitiesRequest
) => {
  const data = await goalApi.addActivityOnGoal(query);

  return data;
};
