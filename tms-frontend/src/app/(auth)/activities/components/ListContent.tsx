import { CardActivity } from "@components/components/card-activity";
import { TStatus } from "@components/components/card-activity/CardActivity";
import React, { useEffect, useRef, useState } from "react";
import CreateOrEditActivityDrawer from "./CreateOrEditActivity";

interface IActivity {
  id: number;
  title: string;
  description: string;
  dateTime: string;
  status: TStatus;
  categories: string[];
}
interface ListContentProps {}

export const ListContent: React.FC<ListContentProps> = ({}) => {
  const [editItem, setEditItem] = useState<IActivity | undefined>();
  const [open, setOpen] = useState(false);
  const listActivity: IActivity[] = [
    {
      id: 1,
      title: "Doing exercise",
      description:
        "Wake up early to do some exercise, Wake up early to do some exercise...max 2 lines and it'll be elipsis",
      dateTime: "08/12/2024 06:00 - 08/12/2024 07:00",
      categories: ["Daily"],
      status: "completed",
    },
    {
      id: 2,
      title: "Doing housework",
      description:
        "Wake up early to do some exercise, Wake up early to do some exercise...max 2 lines and it'll be elipsis",
      dateTime: "08/12/2024 06:00 - 08/12/2024 07:00",
      categories: ["Daily"],
      status: "in-completed",
    },
    {
      id: 3,
      title: "Playing football",
      description:
        "Wake up early to do some exercise, Wake up early to do some exercise...max 2 lines and it'll be elipsis",
      dateTime: "08/12/2024 06:00 - 08/12/2024 07:00",
      categories: ["Passion"],
      status: "completed",
    },
    {
      id: 4,
      title: "Going Gym",
      description:
        "Wake up early to do some exercise, Wake up early to do some exercise...max 2 lines and it'll be elipsis Wake up early to do some exercise...max 2 lines and it'll be elipsis",
      dateTime: "08/12/2024 06:00 - 08/12/2024 07:00",
      categories: ["Passion"],
      status: "on-progress",
    },
    {
      id: 5,
      title: "Cooking",
      description:
        "Wake up early to do some exercise, Wake up early to do some exercise...max 2 lines and it'll be elipsis Wake up early to do some exercise...max 2 lines and it'll be elipsis",
      dateTime: "08/12/2024 06:00 - 08/12/2024 07:00",
      categories: ["Musthave"],
      status: "on-progress",
    },
    {
      id: 6,
      title: "Doing exercise",
      description:
        "Wake up early to do some exercise, Wake up early to do some exercise...max 2 lines and it'll be elipsis Wake up early to do some exercise...max 2 lines and it'll be elipsis",
      dateTime: "08/12/2024 06:00 - 08/12/2024 07:00",
      categories: ["Leisure", "Daily"],
      status: "on-progress",
    },
    {
      id: 7,
      title: "Doing exercise",
      description:
        "Wake up early to do some exercise, Wake up early to do some exercise...max 2 lines and it'll be elipsis Wake up early to do some exercise...max 2 lines and it'll be elipsis",
      dateTime: "08/12/2024 06:00 - 08/12/2024 07:00",
      categories: ["Leisure", "Daily", "Daily", "Daily", "Daily", "Daily"],
      status: "completed",
    },
    {
      id: 8,
      title: "Doing exercise",
      description:
        "Wake up early to do some exercise, Wake up early to do some exercise...max 2 lines and it'll be elipsis Wake up early to do some exercise...max 2 lines and it'll be elipsis",
      dateTime: "08/12/2024 06:00 - 08/12/2024 07:00",
      categories: ["Leisure", "Daily", "Daily", "Daily", "Daily", "Daily"],
      status: "in-completed",
    },
  ];

  const handleEdit = (item: IActivity) => () => {
    setEditItem(item);
    setOpen(true);
  };

  const handleDelete = () => {};

  return (
    <div className="flex flex-wrap gap-4">
      {listActivity.map((item, _index) => (
        <CardActivity
          key={item.id}
          title={item.title}
          description={item.description}
          dateTime={item.dateTime}
          categories={item.categories}
          status={item.status}
          onEdit={handleEdit(item)}
          onDelete={handleDelete}
        />
      ))}

      <CreateOrEditActivityDrawer
        open={open}
        setOpen={setOpen}
        editItem={{
          name: editItem?.title || "",
          description: editItem?.description || "",
          category: editItem?.categories[0] || "",
        }}
      />
    </div>
  );
};
