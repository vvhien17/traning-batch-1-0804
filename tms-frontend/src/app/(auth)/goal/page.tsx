"use client";
import Button from "@components/components/button";
import Container from "@components/components/container";
import Loader from "@components/components/loader";
import Popup from "@components/components/popup/Popup";
import { useGetGoal } from "@components/query/goal/queryHooks";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import React, { useState } from "react";
import FormAddGoal from "./components/FormAddGoal";
import GoalCard from "./components/GoalCard";
import { TItemActivitiesOnGoal } from "@components/types/goal";

export default function GoalPage() {
  const { data, isLoading } = useGetGoal();

  const [isOpen, setIsOpen] = useState(false);

  const handleCreateNewGoal = () => {
    setIsOpen(true);
  };

  return (
    <Container className="pt-10 pb-14">
      <div className="flex justify-between items-center pb-4 mb-6">
        <div className="text-3xl font-bold">Your goal</div>
        <Button
          className="w-max"
          name="Create new goal"
          onClick={handleCreateNewGoal}
        />
      </div>

      {data && data.length >= 1 ? (
        <React.Fragment>
          {isLoading ? (
            <div className="flex h-[20vh] justify-center items-center">
              <Loader />
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {data?.map((item) => (
                <GoalCard key={item.id} items={item} />
              ))}
            </div>
          )}
        </React.Fragment>
      ) : (
        <div className="flex items-center gap-2 text-gray-500">
          <ExclamationCircleIcon className="size-5" />
          <span>No data activity</span>
        </div>
      )}
      <Popup
        title="Create New Activities"
        open={isOpen}
        setOpen={() => setIsOpen(true)}
      >
        <FormAddGoal setIsOpen={() => setIsOpen(false)} />
      </Popup>
    </Container>
  );
}
