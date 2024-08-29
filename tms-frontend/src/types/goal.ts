export interface TCreateGoalRequest {
  name: string;
  startedTime: Date;
  endedTime: Date;
}

export interface TItemGoalOnActivities {
  createdAt: Date;
  goalId: number;
  id: number;
  updatedAt: Date;
  activity: TItemActivities;
  activityId: number;
}

export interface TItemActivities {
  categoryId: null;
  createdAt: Date;
  description: string;
  endedAt: Date;
  id: number;
  isDelete: false;
  name: string;
  startedAt: Date;
  status: "NOT COMPLETED" | "COMPLETED" | "CANCELED";
  updatedAt: Date;
  userId: number;
}

export interface TItemActivitiesOnGoal {
  goal: { name: string };
  categoryId: null;
  createdAt: Date;
  description: string;
  endedAt: Date;
  id: number;
  isDelete: true;
  name: string;
  realSpendTime: null;
  startedAt: Date;
  status: "NOT COMPLETED" | "COMPLETED" | "CANCELED";
  updatedAt: Date;
  userId: number;
}
export interface TItemGoal {
  createdAt: Date;
  endedTime: Date;
  id: number;
  name: string;
  startedTime: Date;
  status: "NOT COMPLETED" | "COMPLETED" | "CANCELED";
  updatedAt: Date;
  userId: number;
  goalOnActivities?: Array<TItemGoalOnActivities>;
  percentComplete: number;
}

export interface TCreateGoalResponse {
  data: TItemGoal;
}

export interface TGoalOnActivitiesRequest {
  goalId: number;
  activityIds: Array<number>;
}
