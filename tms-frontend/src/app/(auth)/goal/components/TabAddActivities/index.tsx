import { useEffect, useRef, useState } from "react";
import {
  useGetActivityOnGoal,
  useGetCanAddToGoal,
} from "@components/query/goal/queryHooks";
import { TItemActivitiesOnGoal } from "@components/types/goal";
import ActivityGoalCard from "../ActivityGoalCard";
import DropdownSelect from "../DropdownSelect";

interface Props {
  goalId: number;
}

const TabAddActivities = ({ goalId }: Props) => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const { data: dataActivityOnGoal, isLoading: isLoadingActivityGoal } =
    useGetActivityOnGoal(goalId);

  const [isOpen, setIsOpen] = useState(false);
  const [filteredActivities, setFilteredActivities] = useState<
    TItemActivitiesOnGoal[]
  >([]);

  useEffect(() => {
    if (dataActivityOnGoal) {
      const activeActivities = dataActivityOnGoal.filter(
        (item) => item.status !== "COMPLETED"
      );
      setFilteredActivities(activeActivities);
    }
  }, [dataActivityOnGoal]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="flex flex-wrap gap-2">
      <div className="relative">
        <div
          ref={dropdownRef}
          onClick={() => setIsOpen(!isOpen)}
          className="w-full h-full px-2 py-2 border-2 border-colors-main text-black rounded-xl text-xs flex items-center justify-center"
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
          setIsClose={() => setIsOpen(false)}
          dropdownRef={dropdownRef}
          setIsOpen={() => setIsOpen(true)}
          goalId={goalId}
          isOpen={isOpen}
        />
      </div>
      {isLoadingActivityGoal ? (
        <span className="flex-[1] h-[36px] animate-pulse inline-block bg-neutral-400 rounded-lg" />
      ) : (
        filteredActivities.map((item) => (
          <ActivityGoalCard
            key={item.id}
            goalId={goalId}
            id={item.id}
            name={item.name}
            startedAt={item.startedAt}
            endedAt={item.endedAt}
            isDone
          />
        ))
      )}
    </div>
  );
};

export default TabAddActivities;
