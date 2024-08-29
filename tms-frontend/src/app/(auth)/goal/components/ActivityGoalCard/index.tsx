import { activityQuery } from "@components/hooks/activity";
import React, { useState } from "react";
import classcat from "classcat";
import Popup from "@components/components/popup/Popup";
import Input from "@components/components/Input";
import { z } from "zod";
import { set } from "date-fns";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useDeleteActivityOnGoal,
  useGetActivityOnGoal,
  useGetGoal,
} from "@components/query/goal/queryHooks";

interface Props {
  name: string;
  id: number;
  isDone?: boolean;
  endedAt: Date;
  startedAt: Date;
  goalId: number;
}

const CompleteActivitySchema = z.object({
  hour: z.string(),
  minute: z.string(),
});

type CompleteActivityForm = z.infer<typeof CompleteActivitySchema>;

const ActivityGoalCard = ({
  name,
  id,
  isDone,
  endedAt,
  startedAt,
  goalId,
}: Props) => {
  const { refetch } = useGetActivityOnGoal(goalId);
  const { refetch: refetchGetGoal } = useGetGoal();

  const { mutate: updateActivity } = activityQuery.mutation.useUpdateActivity();
  const { mutateAsync: deleteActivity } = useDeleteActivityOnGoal();

  const timeSpent = dayjs(endedAt).diff(dayjs(startedAt), "minute") + 1;

  const [openCompletePopup, setOpenCompletePopup] = useState<boolean>(false);

  const { register, handleSubmit, formState } = useForm<CompleteActivityForm>({
    defaultValues: {
      hour: Math.floor(timeSpent / 60).toString(),
      minute: (timeSpent % 60).toString(),
    },
    resolver: zodResolver(CompleteActivitySchema),
  });

  const onComplete = (data: CompleteActivityForm) => {
    updateActivity(
      {
        id,
        status: "COMPLETED",
        realSpendTime: +data.hour * 60 + +data.minute,
      },
      {
        onSuccess() {
          refetchGetGoal();
          refetch();
          setOpenCompletePopup(false);
        },
      }
    );
  };

  const onDelete = () => {
    deleteActivity({ goalId: goalId, activityIds: [id] })
      .then((res) => {
        if (res.isSuccess) {
          refetch();
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div
      className={classcat([
        "px-2 py-0.5 border-2 border-colors-main text-black rounded-xl text-xs flex items-center gap-1",
      ])}
    >
      <p className="text-base font-bold ">{name}</p>
      {isDone && (
        <div
          onClick={() => setOpenCompletePopup(true)}
          className="p-1 border-[1px] border-white rounded-md bg-green-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="white"
            className="size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 12.75 6 6 9-13.5"
            />
          </svg>
        </div>
      )}

      <div
        onClick={onDelete}
        className="p-1 border-[1px] border-white rounded-md bg-red-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="white"
          className="size-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
      </div>

      <Popup
        open={openCompletePopup}
        title="Complete activity"
        setOpen={setOpenCompletePopup}
      >
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-4">
            How much time did you spend on this activity?
          </p>
          <form className="flex gap-4 mb-4">
            <Input
              label="Hours"
              name="hour"
              placeholder="Hours"
              register={register}
              error={formState.errors.hour?.message}
              className="col-span-2"
            />
            <Input
              label="Minutes"
              name="minute"
              placeholder="Minutes"
              register={register}
              error={formState.errors.minute?.message}
              className="col-span-2"
            />
          </form>
          <div className="flex justify-end gap-4">
            <button
              className="px-3 py-1 bg-blue-400 text-white rounded-md w-[110px]"
              onClick={() => setOpenCompletePopup(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit(onComplete)}
              className="px-3 py-1 bg-colors-main text-white rounded-md w-[110px]"
            >
              Confirm
            </button>
          </div>
        </div>
      </Popup>
    </div>
  );
};

export default ActivityGoalCard;
