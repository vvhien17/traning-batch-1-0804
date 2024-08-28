import React, { useState } from "react";
import Button from "@components/components/button";
import {
  useAddActivityOnGoal,
  useGetActivityOnGoal,
  useGetCanAddToGoal,
} from "@components/query/goal/queryHooks";
import { TItemActivitiesOnGoal } from "@components/types/goal";

interface Props {
  arr: TItemActivitiesOnGoal[];
  isOpen: boolean;
  goalId: number;
  setIsOpen: (val: boolean) => void;
}
const DropdownSelect = ({ arr, isOpen, setIsOpen, goalId }: Props) => {
  const { mutateAsync } = useAddActivityOnGoal();
  const { refetch: refetchGetActivitiesOnGoal } = useGetActivityOnGoal(goalId);
  const { refetch: refetchGetCanAddGoal } = useGetCanAddToGoal(goalId);

  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const toggleOption = (value: number) => {
    setSelectedOptions((prevSelected) =>
      prevSelected.includes(value)
        ? prevSelected.filter((option) => option !== value)
        : [...prevSelected, value]
    );
  };

  const onSubmit = () => {
    setIsOpen(false);
    mutateAsync({
      goalId: goalId as number,
      activityIds: selectedOptions,
    })
      .then((res) => {
        if (res.isSuccess) {
          refetchGetActivitiesOnGoal();
          refetchGetCanAddGoal();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <React.Fragment>
      {isOpen && (
        <React.Fragment>
          <div className="px-4 py-2 w-max absolute z-10 mt-2 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            <React.Fragment>
              {arr.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center p-2 hover:bg-gray-100"
                >
                  <input
                    type="checkbox"
                    id={String(option.id)}
                    value={option.id}
                    checked={selectedOptions.includes(option.id)}
                    onChange={() => toggleOption(option.id)}
                    className="mr-2"
                  />
                  <label
                    htmlFor={option.name}
                    className="ml-2 text-sm text-gray-700"
                  >
                    {option.name}
                  </label>
                </div>
              ))}
            </React.Fragment>

            <Button className="mt-0" name="Save" onClick={onSubmit} />
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default DropdownSelect;
