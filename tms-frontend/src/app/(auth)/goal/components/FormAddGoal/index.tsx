import DateTimePickerCustom from "@components/components/DateTimePickerCustom";
import Input from "@components/components/Input";
import { useCreateGoal, useGetGoal } from "@components/query/goal/queryHooks";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";

interface Props {
  setIsOpen: (val: boolean) => void;
}

interface StateProps {
  startDate: Date;
  endDate: Date;
}

const createGoalSchema = z.object({
  name: z.string().min(1, "Name must be at least 1 character"),
});

type CreateGoalForm = z.infer<typeof createGoalSchema>;

const FormAddGoal = ({ setIsOpen }: Props) => {
  const { mutateAsync } = useCreateGoal();
  const { refetch } = useGetGoal();

  const [state, setState] = useState<StateProps>({
    startDate: new Date(),
    endDate: new Date(),
  });

  const { handleSubmit, register, formState, reset } = useForm<CreateGoalForm>({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(createGoalSchema),
  });

  const onSubmit = (data: CreateGoalForm) => {
    mutateAsync({
      ...data,
      startedTime: state.startDate,
      endedTime: state.endDate,
    })
      .then((data) => {
        reset();
        refetch();
        setIsOpen(false);
        toast.success(data.message);
      })
      .catch((data) => {
        toast.error(data.message);
      });
  };

  return (
    <div>
      <form className="flex gap-4 flex-col">
        <Input
          label="Name"
          name="name"
          placeholder="Name"
          register={register}
          error={formState.errors.name?.message}
          className="col-span-2"
        />

        <div className="[&>div]:w-full">
          <p className="text-sm font-semibold text-gray-700 mb-1">Start date</p>
          <DateTimePickerCustom
            id="startDate"
            dateTime={state.startDate}
            setDateTime={(val) =>
              setState((prev) => ({
                ...prev,
                startDate: val,
              }))
            }
          />
        </div>
        <div className="[&>div]:w-full">
          <p className="text-sm font-semibold text-gray-700 mb-1">End date</p>
          <DateTimePickerCustom
            id="endDate"
            dateTime={state.endDate}
            setDateTime={(val) =>
              setState((prev) => ({
                ...prev,
                endDate: val,
              }))
            }
          />
        </div>
      </form>
      <div className="py-3 flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          className="inline-flex w-full justify-center rounded-md bg-colors-main px-3 py-2 text-sm font-semibold text-white shadow-sm sm:w-auto"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default FormAddGoal;
