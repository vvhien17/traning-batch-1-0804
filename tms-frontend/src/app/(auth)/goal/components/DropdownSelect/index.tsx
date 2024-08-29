import React, { useState, useCallback } from "react";
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
  isOpen: boolean;
  goalId: number;
  setIsOpen: (val: boolean) => void;
  setIsClose: (val: boolean) => void;
  dropdownRef: React.MutableRefObject<HTMLDivElement | null>;
}

const DropdownSelect = ({
  isOpen,
  setIsOpen,
  setIsClose,
  goalId,
  dropdownRef,
}: Props) => {
  const { mutateAsync } = useAddActivityOnGoal();
  const { refetch: refetchGetActivitiesOnGoal } = useGetActivityOnGoal(goalId);
  const {
    refetch: refetchGetCanAddGoal,
    data: dataCanAddGoal,
    isLoading: isLoadingCanAddGoal,
  } = useGetCanAddToGoal(goalId);
  const { refetch: refetchGetGoal } = useGetGoal();

  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

  const toggleOption = useCallback((value: number) => {
    setSelectedOptions((prevSelected) =>
      prevSelected.includes(value)
        ? prevSelected.filter((option) => option !== value)
        : [...prevSelected, value]
    );
  }, []);

  const onSubmit = useCallback(async () => {
    try {
      setIsOpen(false);
      const response = await mutateAsync({
        goalId,
        activityIds: selectedOptions,
      });

      if (response.isSuccess) {
        refetchGetGoal();
        refetchGetActivitiesOnGoal();
        refetchGetCanAddGoal();
        setIsClose(false);
      }
    } catch (error) {
      console.error("Error submitting activities:", error);
    }
  }, [
    goalId,
    mutateAsync,
    selectedOptions,
    setIsOpen,
    setIsClose,
    refetchGetGoal,
    refetchGetActivitiesOnGoal,
    refetchGetCanAddGoal,
  ]);

  return isOpen ? (
    <div
      ref={dropdownRef}
      className="px-4 py-2 w-max absolute z-10 mt-2 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
    >
      {isLoadingCanAddGoal ? (
        <Loader />
      ) : (
        <>
          {dataCanAddGoal?.map((option) => (
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
        </>
      )}
    </div>
  ) : null;
};

export default DropdownSelect;
