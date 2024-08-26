export interface TCreateGoalRequest {
  name: string;
  startedTime: Date;
  endedTime: Date;
}

export interface TItemActivities {
  id: number;
  name: string;
  time: string;
  category: string;
  description: string;
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
  activities?: Array<TItemActivities>;
}

export interface TCreateGoalResponse {
  data: TItemGoal;
}
