import { CardActivity } from "@components/components/card-activity";
import { TStatus } from "@components/components/card-activity/CardActivity";
import React, { useEffect, useRef, useState } from "react";
import CreateOrEditActivityDrawer from "./CreateOrEditActivity";
import { activityQuery } from "@components/hooks/activity";
import { TActivity } from "@components/types/activity";

interface ListContentProps {}

export const ListContent: React.FC<ListContentProps> = ({}) => {
  const [editItem, setEditItem] = useState<TActivity | undefined>();
  const [open, setOpen] = useState(false);
  const { data: activitiesData } = activityQuery.query.useGetActivities({});
  const activities = activitiesData?.data || [];
  console.log({ activities });

  const handleEdit = (item: TActivity) => () => {
    setEditItem(item);
    setOpen(true);
  };

  const handleDelete = () => {};

  return (
    <div className="flex flex-wrap gap-4">
      {activities.map((item, _index) => (
        <CardActivity
          key={item.id}
          title={item.name}
          description={item.description}
          startedAt={item.startedAt}
          endedAt={item.endedAt}
          categoryName={item.categoryId}
          status="completed"
          onEdit={handleEdit(item)}
          onDelete={handleDelete}
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
