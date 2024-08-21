import { Status } from "@components/constants/common";
import {
  CalendarDateRangeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import classcat from "classcat";
import React, { useEffect, useRef, useState } from "react";

export type TStatus = "completed" | "on-progress" | "in-completed";

interface CardActivityProps {
  title: string;
  description: string;
  dateTime: string;
  categories: string[];
  status: TStatus;
  onEdit: () => void;
  onDelete: () => void;
}

export const CardActivity: React.FC<CardActivityProps> = ({
  title,
  description,
  dateTime,
  categories,
  status,
  onEdit,
  onDelete,
}) => {
  const [isEllipsisActive, setIsEllipsisActive] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const descriptionRef = useRef<HTMLParagraphElement | null>(null);

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
        "border border-t-4 max-w-[400px] bg-white rounded-lg p-4 shadow-lg relative",
        status === Status.Completed
          ? "border-t-green-500"
          : status === Status.InCompleted
          ? "border-t-red-500"
          : status === Status.Onprogress
          ? "border-t-yellow-500"
          : "border-t-colors-main",
      ])}
    >
      <div className="flex items-baseline gap-6">
        <h3 className="font-bold text-lg pb-2">{title}</h3>
        <span
          className={classcat([
            "rounded-lg px-2 text-white",
            status === Status.Completed
              ? "bg-green-500"
              : status === Status.InCompleted
              ? "bg-red-500"
              : status === Status.Onprogress
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
        <CalendarDateRangeIcon className="size-5" /> {dateTime}
      </p>
      <div className="flex justify-between items-center mt-4">
        <div className="flex flex-wrap basis-3/4 gap-1">
          {categories.map((category, index) => (
            <span
              key={index}
              className="mx-0.5 px-2 py-1 border-2 border-colors-main text-black rounded-full text-xs"
            >
              {category}
            </span>
          ))}
        </div>
        <div className="flex basis-1/4 justify-end">
          <button onClick={onEdit}>
            <PencilSquareIcon className="size-5 text-black-500" />
          </button>
          <button onClick={onDelete} className="px-3 py-1">
            <TrashIcon className="size-5 text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
};
