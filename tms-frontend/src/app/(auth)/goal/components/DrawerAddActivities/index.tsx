import React, { useEffect, useMemo, useState, useCallback } from "react";
import CreateOrEditActivityDrawer from "@components/app/(auth)/activities/components/CreateOrEditActivity";
import Drawer from "@components/components/Drawer";
import { STYLES_STATUS } from "@components/constants/common";
import { TItemGoal } from "@components/types/goal";
import classcat from "classcat";
import dayjs from "dayjs";
import GoalProgress from "../GoalProgress";
import TabActivitiesCompleted from "../TabActivitiesCompleted";
import TabAddActivities from "../TabAddActivities";

interface Props {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  itemGoal: TItemGoal | null;
}

const DrawerAddActivitiesOnGoal = ({ isOpen, setIsOpen, itemGoal }: Props) => {
  const [isOpenTab, setIsOpenTab] = useState(0);
  const [isOpenActivities, setIsOpenActivities] = useState(false);

  const TabMap = useMemo(
    () => [
      {
        key: 0,
        title: "Current Activities",
        comp: <TabAddActivities goalId={Number(itemGoal?.id)} />,
      },
      {
        key: 1,
        title: "Completed Activities",
        comp: <TabActivitiesCompleted goalId={Number(itemGoal?.id)} />,
      },
    ],
    [itemGoal]
  );

  const { textColor } = itemGoal?.status
    ? STYLES_STATUS[itemGoal.status] ?? { textColor: "text-neutral-400" }
    : { textColor: "text-neutral-400" };

  const renderTab = TabMap[isOpenTab]?.comp;

  const handleTabClick = useCallback((key: number) => {
    setIsOpenTab(key);
  }, []);

  const handleAddActivityClick = useCallback(() => {
    setIsOpenActivities(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const handleCloseActivityDrawer = useCallback(() => {
    setIsOpenActivities(false);
  }, []);

  useEffect(() => {
    if (!itemGoal) {
      setIsOpenTab(0);
    }
  }, [itemGoal]);

  return (
    <>
      <Drawer open={isOpen} onClose={handleCloseDrawer}>
        <div className="flex items-center justify-between p-6 border-b border-stone-300">
          <h3 className="text-lg font-semibold">Activities on goal</h3>
          <div
            className="rounded-xl border-[1px] bg-sky-400 border-black px-2 py-1 flex items-center gap-1 cursor-pointer"
            onClick={handleAddActivityClick}
          >
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
            <p className="text-sm">Add new activity</p>
          </div>
        </div>

        <div className="p-2 flex items-center justify-start gap-2 border-[1px] border-colors-main m-4 rounded-xl">
          <GoalProgress percent={Number(itemGoal?.percentComplete)} />
          <p className="text-lg font-bold">{itemGoal?.name}</p>
        </div>

        <div className="grid grid-cols-3 py-4 border-[1px] border-colors-main m-4 rounded-xl">
          {["Start Date", "End Date", "Status"].map((label, index) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center gap-2"
            >
              <p className="text-base font-medium">{label}</p>
              <div className="text-sm">
                {index === 0 ? (
                  dayjs(itemGoal?.startedTime).format("DD/MM/YYYY HH:mm")
                ) : index === 1 ? (
                  dayjs(itemGoal?.endedTime).format("DD/MM/YYYY HH:mm")
                ) : (
                  <div className={classcat([textColor, "text-sm"])}>
                    {itemGoal?.status}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-[1px] border-colors-main m-4 rounded-xl">
          <div className="flex items-center justify-evenly border-b-[1px] border-gray-600 mb-5 ">
            {TabMap.map(({ key, title }) => (
              <div
                key={key}
                className={classcat([
                  isOpenTab === key
                    ? "text-sky-500 border-sky-500 border-b-2"
                    : "",
                  "mb-2 cursor-pointer",
                ])}
                onClick={() => handleTabClick(key)}
              >
                {title}
              </div>
            ))}
          </div>
          {renderTab}
        </div>
      </Drawer>

      <CreateOrEditActivityDrawer
        open={isOpenActivities}
        setOpen={handleCloseActivityDrawer}
      />
    </>
  );
};

export default DrawerAddActivitiesOnGoal;
