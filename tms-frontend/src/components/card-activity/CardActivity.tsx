import { Status } from "@components/constants/common";
import {
  CalendarDateRangeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import classcat from "classcat";
import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import Popup from "../popup/Popup";
import { activityQuery } from "@components/hooks/activity";
import { toast } from "react-toastify";
import { TypeErrorResponse } from "@components/types/types";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../Input";

const CompleteActivitySchema = z.object({
  hour: z.string(),
  minute: z.string(),
});

type CompleteActivityForm = z.infer<typeof CompleteActivitySchema>;

export type TStatus = "NOT_COMPLETED" | "COMPLETED" | "CANCELED";

interface CardActivityProps {
  id: number;
  title: string;
  description: string;
  startedAt: string;
  endedAt: string;
  categoryName?: string;
  status: TStatus;
  onEdit: () => void;
}

export const CardActivity: React.FC<CardActivityProps> = ({
  id,
  title,
  description,
  startedAt,
  endedAt,
  categoryName,
  status,
  onEdit,
}) => {
  const [isEllipsisActive, setIsEllipsisActive] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const [openCompletePopup, setOpenCompletePopup] = useState<boolean>(false);
  const descriptionRef = useRef<HTMLParagraphElement | null>(null);
  const timeSpent = dayjs(endedAt).diff(dayjs(startedAt), "minute");
  const { register, handleSubmit, formState } = useForm<CompleteActivityForm>({
    defaultValues: {
      hour: Math.floor(timeSpent / 60).toString(),
      minute: (timeSpent % 60).toString(),
    },
    resolver: zodResolver(CompleteActivitySchema),
  });

  const { mutate: updateActivity } = activityQuery.mutation.useUpdateActivity();
  const { mutate: deleteActivity } = activityQuery.mutation.useDeleteActivity();

  const handleDelete = () => {
    deleteActivity(id.toString(), {
      onSuccess: (data) => {
        toast(data.message, {
          type: "success",
        });
      },
      onError: (error: any) => {
        const _error: TypeErrorResponse = error;
        toast(_error.response.data.message, {
          type: "error",
        });
      },
    });
    setOpenPopup(false);
  };

  const handleComplete = (data: CompleteActivityForm) => {
    updateActivity({
      id,
      status: "COMPLETED",
      realSpendTime: +data.hour * 60 + +data.minute,
    });
  };

  useEffect(() => {
    const checkEllipsis = () => {
      if (descriptionRef.current) {
        setIsEllipsisActive(
          descriptionRef.current.scrollHeight >
            descriptionRef.current.clientHeight
        );
      }
    };

    checkEllipsis();
    window.addEventListener("resize", checkEllipsis);

    return () => window.removeEventListener("resize", checkEllipsis);
  }, [description]);

  return (
    <div
      className={classcat([
        "border border-t-4 max-w-[400px] min-w-[400px] bg-white rounded-lg p-4 shadow-lg relative",
        status === Status.COMPLETED
          ? "border-t-green-500"
          : status === Status.CANCELED
          ? "border-t-red-500"
          : status === Status.NOT_COMPLETED
          ? "border-t-yellow-500"
          : "border-t-colors-main",
      ])}
    >
      <div className="flex items-baseline gap-6">
        <h3 className="font-bold text-lg pb-2">{title}</h3>
        <span
          className={classcat([
            "rounded-lg px-2 text-white",
            status === Status.COMPLETED
              ? "bg-green-500"
              : status === Status.CANCELED
              ? "bg-red-500"
              : status === Status.NOT_COMPLETED
              ? "bg-yellow-500"
              : "bg-colors-main",
          ])}
        >
          {status}
        </span>
      </div>
      <div
        className="relative"
        onMouseEnter={() => isEllipsisActive && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <p ref={descriptionRef} className="text-sm text-gray-600 line-clamp-2">
          {description}
        </p>
        {showTooltip && (
          <div className="absolute z-10 p-2 bg-gray-800 text-white text-xs rounded shadow-lg max-w-xs bottom-full left-0 mb-1">
            {description}
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-2 flex items-end gap-1">
        <CalendarDateRangeIcon className="size-5" />{" "}
        {dayjs(startedAt).format("DD/MM/YYYY HH:mm")} -{" "}
        {dayjs(endedAt).format("DD/MM/YYYY HH:mm")}
      </p>
      <div className="flex justify-between items-center justify-end mt-4">
        {!!categoryName && (
          <div className="flex flex-wrap basis-3/4 gap-1">
            <span className="mx-0.5 px-2 py-1 border-2 border-colors-main text-black rounded-full text-xs">
              {categoryName}
            </span>
          </div>
        )}
        <div className="flex">
          <button onClick={onEdit} aria-label="Edit activity">
            <PencilSquareIcon className="size-5 text-black-500" />
          </button>
          <button onClick={() => setOpenPopup(true)} className="px-3 py-1">
            <TrashIcon className="size-5 text-red-500" />
          </button>
          {status !== "COMPLETED" && (
            <button
              className="px-3 py-1 bg-blue-400 text-white rounded-md w-[110px]"
              onClick={() => setOpenCompletePopup(true)}
            >
              Mark done
            </button>
          )}
        </div>
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
              onClick={handleSubmit(handleComplete)}
              className="px-3 py-1 bg-colors-main text-white rounded-md w-[110px]"
            >
              Confirm
            </button>
          </div>
        </div>
      </Popup>
      <Popup open={openPopup} title="Delete activity" setOpen={setOpenPopup}>
        <div className="flex flex-col gap-4">
          <p className="text-sm font-semibold text-gray-700">
            Are you sure you want to delete this activity?
          </p>
          <div className="flex justify-end gap-4">
            <button
              className="px-3 py-1 bg-red-500 text-white rounded-md"
              onClick={handleDelete}
            >
              Yes
            </button>
            <button
              className="px-3 py-1 bg-gray-200 text-black rounded-md"
              onClick={() => setOpenPopup(false)}
            >
              No
            </button>
          </div>
        </div>
      </Popup>
    </div>
  );
};
