import React, { useEffect, useState } from "react";
import ActivityGoalCard from "../ActivityGoalCard";
import { TItemActivitiesOnGoal } from "@components/types/goal";

import { useGetActivityOnGoal } from "@components/query/goal/queryHooks";

interface Props {
  goalId: number;
}

const TabActivitiesCompleted = ({ goalId }: Props) => {
  const { data } = useGetActivityOnGoal(goalId);

  const [_data, setData] = useState<Array<TItemActivitiesOnGoal>>(data || []);

  useEffect(() => {
    if (!data) return;

    const dataFilter = data.filter((item) => item.status === "COMPLETED");

    setData(dataFilter);
  }, [data]);
  return (
    <React.Fragment>
      {_data && _data.length >= 1 ? (
        <div className="flex flex-wrap gap-2">
          {_data?.map((item) => (
            <ActivityGoalCard
              endedAt={item.endedAt}
              startedAt={item.startedAt}
              goalId={goalId}
              isDone={false}
              id={item.id}
              key={item.id}
              name={item.name}
            />
          ))}
        </div>
      ) : (
        <p className="text-center m-1 text-green-700 underline">
          You current is don&apos;t anything activity is complete
        </p>
      )}
    </React.Fragment>
  );
};

export default TabActivitiesCompleted;
