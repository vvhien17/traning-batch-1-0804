import { EnumStatusGoal } from "@components/enums";
import { TItemGoal } from "@components/types/goal";
import dayjs from "dayjs";
import classcat from "classcat";

const styleMaps = {
  [EnumStatusGoal.COMPLETED]: {
    statusColor: "bg-green-500",
    borderColor: "border-green-400",
  },
  [EnumStatusGoal.CANCELED]: {
    statusColor: "bg-red-500",
    borderColor: "border-red-400",
  },
  [EnumStatusGoal.IN_PROGRESS]: {
    statusColor: "bg-yellow-500",
    borderColor: "border-yellow-400",
  },
  [EnumStatusGoal.PENDING]: {
    statusColor: "bg-blue-500",
    borderColor: "border-blue-400",
  },
};

export default function GoalCard({
  name,
  createdAt,
  updatedAt,
  activities,
  status,
}: TItemGoal) {
  const { statusColor, borderColor } = styleMaps[status] || {
    statusColor: "bg-colors-main",
    borderColor: "border-neutral-400",
  };

  return (
    <div
      className={classcat([
        "p-4 cursor-pointer rounded-xl border bg-white",
        borderColor,
      ])}
    >
      <div className="flex items-center justify-between gap-2 mb-4">
        <p className="text-xl font-bold">{name}</p>
        <span className={classcat(["rounded-lg px-2 text-white", statusColor])}>
          {status}
        </span>
      </div>
      <p className="text-sm text-gray-500 text-end">
        {dayjs(createdAt).format("DD/MM/YYYY HH:mm")} -{" "}
        {dayjs(updatedAt).format("DD/MM/YYYY HH:mm")}
      </p>
      <div className="grid gap-4">
        {activities?.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl border border-neutral-400 bg-white"
          >
            <p className="text-lg font-bold mb-2">{item.name}</p>
            <p className="text-sm text-gray-500 mb-2">{item.time}</p>
            <p className="text-sm text-gray-500">{item.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
