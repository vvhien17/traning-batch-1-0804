import React, { useState } from "react";
import {
  useGetActivityOnGoal,
  useGetCanAddToGoal,
} from "@components/query/goal/queryHooks";
import ActivityGoalCard from "../ActivityGoalCard";
import DropdownSelect from "../DropdownSelect";

interface Props {
  idGoal: number;
}

const TabAddActivities = ({ idGoal }: Props) => {
  const { data: dataCanAddGoal } = useGetCanAddToGoal(idGoal);
  const { data: dataAddedGoal } = useGetActivityOnGoal(idGoal);

  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex flex-wrap gap-2">
      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className=" w-full h-full px-2 py-2 border-2 border-colors-main text-black rounded-xl text-xs flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </div>
        <DropdownSelect
          goalId={idGoal}
          isOpen={isOpen}
          setIsOpen={() => setIsOpen(true)}
          arr={dataCanAddGoal || []}
        />
      </div>
      {dataAddedGoal?.map((item) => (
        <ActivityGoalCard id={item.id} key={item.id} isDone name={item?.name} />
      ))}
    </div>
  );
};
export default TabAddActivities;
