import { EnumStatusGoal } from "@components/enums";

export enum Status {
  NOT_COMPLETED = "NOT_COMPLETED",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
}

export const ACCESS_TOKEN = "accessToken";
export const USER_INFO = "userInfo";

export const STYLES_STATUS = {
  [EnumStatusGoal.COMPLETED]: {
    textColor: "text-green-500",
    statusColor: "bg-green-500",
    borderColor: "border-green-500",
  },
  [EnumStatusGoal.CANCELED]: {
    textColor: "text-red-500",
    statusColor: "bg-red-500",
    borderColor: "border-red-400",
  },
  [EnumStatusGoal.NOT_COMPLETED]: {
    textColor: "!text-yellow-500",
    statusColor: "bg-yellow-500",
    borderColor: "border-yellow-400",
  },
};
