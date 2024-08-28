import { EnumStatusGoal } from "@components/enums";
import { TItemGoal } from "@components/types/goal";
import dayjs from "dayjs";
import classcat from "classcat";
import GoalProgress from "./GoalProgress";
import React, { useState } from "react";
import DrawerAddActivitiesOnGoal from "./DrawerAddActivities";

const styleMaps = {
  [EnumStatusGoal.COMPLETED]: {
    statusColor: "bg-green-500",
    borderColor: "border-green-400",
  },
  [EnumStatusGoal.CANCELED]: {
    statusColor: "bg-red-500",
    borderColor: "border-red-400",
  },
  [EnumStatusGoal.IN_PROGRESS]: {
    statusColor: "bg-yellow-500",
    borderColor: "border-yellow-400",
  },
  [EnumStatusGoal.PENDING]: {
    statusColor: "bg-blue-500",
    borderColor: "border-blue-400",
  },
};
interface Props {
  items: TItemGoal;
}
export default function GoalCard({ items }: Props) {
  const {
    createdAt,
    name,
    percentComplete,
    status,
    updatedAt,
    goalOnActivities,
  } = items;
  const { statusColor, borderColor } = styleMaps[status] || {
    statusColor: "bg-colors-main",
    borderColor: "border-neutral-400",
  };

  const [isOpen, setIsOpen] = useState(false);
  const [itemGoal, setItemGoal] = useState<TItemGoal>();

  const onOpenDrawer = (item: TItemGoal) => {
    setIsOpen(true);
    setItemGoal(item);
  };
  return (
    <div
      onClick={() => onOpenDrawer(items)}
      className={classcat([
        "p-4 cursor-pointer rounded-xl border bg-white",
        borderColor,
      ])}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center justify-start gap-2">
              <p className="text-xl font-bold">{name}</p>
              <span
                className={classcat([
                  "rounded-lg text-sm px-2 text-white",
                  statusColor,
                ])}
              >
                {status}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-500 text-end">
            {dayjs(createdAt).format("DD/MM/YYYY HH:mm")} -{" "}
            {dayjs(updatedAt).format("DD/MM/YYYY HH:mm")}
          </p>
        </div>
        <GoalProgress percent={percentComplete} />
      </div>
      {goalOnActivities && goalOnActivities.length >= 1 && (
        <React.Fragment>
          <p className="text-sm mt-1 underline text-green-500">
            What you have to do :{" "}
          </p>
          <div className="flex flex-wrap gap-1 mt-1">
            {goalOnActivities?.map((item) => (
              <div
                key={item.id}
                className="p-1 rounded-md border border-neutral-400 bg-white w-max"
              >
                <p className="text-sm font-[500]">{item.activity.name}</p>
              </div>
            ))}
          </div>
        </React.Fragment>
      )}

      <DrawerAddActivitiesOnGoal
        itemGoal={itemGoal as TItemGoal}
        isOpen={isOpen}
        setIsOpen={() => setIsOpen(false)}
      />
    </div>
  );
}
