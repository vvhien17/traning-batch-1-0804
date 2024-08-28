import Drawer from "@components/components/Drawer";
import { TItemGoal } from "@components/types/goal";
import React, { useMemo, useState } from "react";
import GoalProgress from "../GoalProgress";
import classcat from "classcat";
import dayjs from "dayjs";
import { STYLES_STATUS } from "@components/constants/common";
import TabAddActivities from "../TabAddActivities";
import TabActivitiesCompleted from "../TabActivitiesCompleted";
import CreateOrEditActivityDrawer from "@components/app/(auth)/activities/components/CreateOrEditActivity";
interface Props {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  itemGoal: TItemGoal;
}

interface StateProps {
  isOpenTab: number;
  isOpenActivities: boolean;
}
const DrawerAddActivitiesOnGoal = ({ isOpen, setIsOpen, itemGoal }: Props) => {
  const { textColor } = STYLES_STATUS[itemGoal?.status] || {
    textColor: "text-neutral-400",
  };

  const [state, setState] = useState<StateProps>({
    isOpenActivities: false,
    isOpenTab: 0,
  });

  const TabMap = useMemo(
    () => [
      {
        key: 0,
        title: "Current Activities",
        comp: <TabAddActivities idGoal={itemGoal?.id} />,
      },
      {
        key: 1,
        title: "Completed Activities",
        comp: <TabActivitiesCompleted idGoal={itemGoal?.id} />,
      },
    ],
    [state.isOpenTab, isOpen]
  );

  const renderTab = TabMap[state.isOpenTab].comp;

  return (
    <React.Fragment>
      <Drawer open={isOpen} onClose={() => setIsOpen(true)}>
        <div className="flex items-center justify-between p-6 border-b border-stone-300">
          <h3 className="text-lg font-semibold">Activities on goal</h3>

          <div className="rounded-xl border-[1px] bg-sky-400 border-black px-2 py-1 flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            <p
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  isOpenActivities: true,
                }))
              }
              className="text-sm"
            >
              Add new activity
            </p>
          </div>
        </div>

        <div className="p-2 flex items-center justify-start gap-2 border-[1px] border-colors-main m-4 rounded-xl">
          <GoalProgress percent={itemGoal?.percentComplete} />
          <p className="text-lg font-bold">{itemGoal?.name}</p>
        </div>

        <div className="grid grid-cols-3 py-4 border-[1px] border-colors-main m-4 rounded-xl">
          <div className="flex flex-col items-center justify-center gap-2">
            <p className="text-base font-medium">Start Date</p>

            <div className="text-sm">
              {dayjs(itemGoal?.startedTime).format("DD/MM/YYYY HH:mm")}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-2">
            <p className="text-base font-medium">End Date</p>

            <div className="text-sm">
              {dayjs(itemGoal?.endedTime).format("DD/MM/YYYY HH:mm")}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-2 ">
            <p className="text-base font-medium">Status</p>

            <div className={classcat([textColor, "text-sm"])}>
              {itemGoal?.status}
            </div>
          </div>
        </div>

        <div className="p-4 border-[1px] border-colors-main m-4 rounded-xl">
          <div className="flex items-center justify-evenly border-b-[1px] border-gray-600 mb-5 ">
            {TabMap.map((item) => {
              const isActive = state.isOpenTab === item.key;
              return (
                <div
                  className={classcat([
                    isActive ? "text-sky-500 border-sky-500 border-b-2" : "",
                    "mb-2",
                  ])}
                  onClick={() =>
                    setState((prev) => ({
                      ...prev,
                      isOpenTab: item.key,
                    }))
                  }
                  key={item.key}
                >
                  {item.title}
                </div>
              );
            })}
          </div>

          {renderTab}
        </div>
      </Drawer>

      <CreateOrEditActivityDrawer
        open={state.isOpenActivities}
        setOpen={() =>
          setState((prev) => ({
            ...prev,
            isOpenActivities: false,
          }))
        }
      />
    </React.Fragment>
  );
};

export default DrawerAddActivitiesOnGoal;
