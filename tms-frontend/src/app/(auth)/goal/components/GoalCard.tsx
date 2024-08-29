import { TItemGoal } from "@components/types/goal";
import dayjs from "dayjs";
import classcat from "classcat";
import GoalProgress from "./GoalProgress";
import React, { useState } from "react";
import DrawerAddActivitiesOnGoal from "./DrawerAddActivities";
import { STYLES_STATUS } from "@components/constants/common";

interface Props {
  items: TItemGoal;
}
export default function GoalCard({ items }: Props) {
  const {
    endedTime = new Date(),
    name,
    percentComplete,
    status,
    startedTime = new Date(),
    goalOnActivities,
  } = items;
  const { statusColor, borderColor } = STYLES_STATUS[status] || {
    statusColor: "bg-colors-main",
    borderColor: "border-neutral-400",
  };

  const [isOpen, setIsOpen] = useState(false);

  const onOpenDrawer = () => {
    setIsOpen(true);
  };

  const onCloseDrawer = () => {
    setIsOpen(false);
  };
  return (
    <div
      onClick={onOpenDrawer}
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
          <p className="text-sm text-gray-500 text-start">
            {dayjs(startedTime).format("DD/MM/YYYY HH:mm")} -{" "}
            {dayjs(endedTime).format("DD/MM/YYYY HH:mm")}
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
                className="mx-0.5 px-2 py-1 border-2 border-colors-main text-black rounded-full text-xs"
              >
                <p className="text-sm font-[500]">{item.activity.name}</p>
              </div>
            ))}
          </div>
        </React.Fragment>
      )}

      {items && (
        <DrawerAddActivitiesOnGoal
          itemGoal={isOpen ? items : null}
          isOpen={isOpen}
          setIsOpen={onCloseDrawer}
        />
      )}
    </div>
  );
}
