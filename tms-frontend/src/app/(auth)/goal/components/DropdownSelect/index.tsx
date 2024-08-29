import React, { useEffect, useRef, useState } from "react";
import Button from "@components/components/button";
import {
  useAddActivityOnGoal,
  useGetActivityOnGoal,
  useGetCanAddToGoal,
  useGetGoal,
} from "@components/query/goal/queryHooks";
import { TItemActivitiesOnGoal } from "@components/types/goal";
import Loader from "@components/components/loader";

interface Props {
  arr: TItemActivitiesOnGoal[];
  isOpen: boolean;
  goalId: number;
  setIsOpen: (val: boolean) => void;
  setIsClose: (val: boolean) => void;
  isLoading: boolean;
  dropdownRef: React.MutableRefObject<HTMLDivElement | null>;
}
const DropdownSelect = ({
  arr,
  isOpen,
  setIsOpen,
  setIsClose,
  isLoading,
  goalId,
  dropdownRef,
}: Props) => {
  const { mutateAsync } = useAddActivityOnGoal();
  const { refetch: refetchGetActivitiesOnGoal } = useGetActivityOnGoal(goalId);
  const { refetch: refetchGetCanAddGoal } = useGetCanAddToGoal(goalId);
  const { refetch: refetchGetGoal } = useGetGoal();

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
          refetchGetGoal();
          refetchGetActivitiesOnGoal();
          refetchGetCanAddGoal();
          setIsClose(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <React.Fragment>
      {isOpen && (
        <div
          ref={dropdownRef}
          className="px-4 py-2 w-max absolute z-10 mt-2 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {isLoading ? (
            <Loader />
          ) : (
            <React.Fragment>
              {arr.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center p-2 hover:bg-gray-100"
                >
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id={String(option.id)}
                      value={option.id}
                      checked={selectedOptions.includes(option.id)}
                      onChange={() => toggleOption(option.id)}
                      className="mr-2"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {option.name}
                    </span>
                  </label>
                </div>
              ))}
              <Button className="!mt-1" name="Save" onClick={onSubmit} />
            </React.Fragment>
          )}
        </div>
      )}
    </React.Fragment>
  );
};

export default DropdownSelect;
