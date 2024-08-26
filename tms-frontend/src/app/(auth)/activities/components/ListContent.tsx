import { CardActivity } from "@components/components/card-activity";
import { TStatus } from "@components/components/card-activity/CardActivity";
import React, { useEffect, useRef, useState } from "react";
import CreateOrEditActivityDrawer from "./CreateOrEditActivity";
import { activityQuery } from "@components/hooks/activity";
import { TActivity } from "@components/types/activity";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

interface ListContentProps {}

export const ListContent: React.FC<ListContentProps> = ({}) => {
  const [editItem, setEditItem] = useState<TActivity | undefined>();
  const [open, setOpen] = useState(false);
  const { data: activitiesData } = activityQuery.query.useGetActivities({});
  const activities = activitiesData?.data || [];

  const handleEdit = (item: TActivity) => () => {
    setEditItem(item);
    setOpen(true);
  };

  const handleDelete = () => {};

  if (activities.length < 1)
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <ExclamationCircleIcon className="size-5" />
        <span>No data activity</span>
      </div>
    );

  return (
    <div className="flex flex-wrap gap-4">
      {activities.map((item, _index) => (
        <CardActivity
          key={item.id}
          id={item.id}
          title={item.name}
          description={item.description}
          startedAt={item.startedAt}
          endedAt={item.endedAt}
          categoryName={item.category?.name}
          status="completed"
          onEdit={handleEdit(item)}
        />
      ))}

      <CreateOrEditActivityDrawer
        open={open}
        setOpen={setOpen}
        editItem={{
          id: editItem?.id || 0,
          name: editItem?.name || "",
          description: editItem?.description || "",
          category: editItem?.categoryId || "",
        }}
      />
    </div>
  );
};
