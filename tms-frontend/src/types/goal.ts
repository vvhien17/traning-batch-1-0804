export interface TCreateGoalRequest {
  name: string;
  startedTime: Date;
  endedTime: Date;
}

export interface TItemGoalOnActivities {
  createdAt: Date;
  goalId: number;
  id: number;
  totalSpend: number;
  updatedAt: Date;
  activity: TItemActivities;
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
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELED";
  updatedAt: Date;
  userId: number;
}
export interface TItemGoal {
  createdAt: Date;
  endedTime: Date;
  id: number;
  name: string;
  startedTime: Date;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELED";
  updatedAt: Date;
  userId: number;
  goalOnActivities?: Array<TItemGoalOnActivities>;
  percentComplete: number;
}

export interface TCreateGoalResponse {
  data: TItemGoal;
}
