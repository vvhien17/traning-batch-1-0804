import { useGetActivityOnGoal } from "@components/query/goal/queryHooks";
import React, { useEffect, useState } from "react";
import ActivityGoalCard from "../ActivityGoalCard";
import { TItemActivitiesOnGoal } from "@components/types/goal";

interface Props {
  idGoal: number;
}

const TabActivitiesCompleted = ({ idGoal }: Props) => {
  const { data } = useGetActivityOnGoal(idGoal);

  const [_data, setData] = useState<Array<TItemActivitiesOnGoal>>([]);

  useEffect(() => {
    if (!data) return;

    const dataCompleted = data.filter((item) => item.status === "COMPLETED");

    setData(dataCompleted);
  }, [data]);
  return (
    <React.Fragment>
      {_data && _data.length >= 1 ? (
        <>
          {_data?.map((item) => (
            <ActivityGoalCard
              isDone={false}
              id={item.id}
              key={item.id}
              name={item.name}
            />
          ))}
        </>
      ) : (
        <p className="text-center m-1 text-green-700 underline">
          You current is don&apos;t anything activity is complete
        </p>
      )}
    </React.Fragment>
  );
};

export default TabActivitiesCompleted;
