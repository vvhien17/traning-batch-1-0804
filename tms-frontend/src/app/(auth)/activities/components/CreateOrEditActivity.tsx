"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Drawer from "@components/components/Drawer";
import Input from "@components/components/Input";
import Textarea from "@components/components/TextArea";
import DateTimePickerCustom from "@components/components/DateTimePickerCustom";
import Select from "@components/components/Select";
import Button from "@components/components/button";
import { activityQuery } from "@components/hooks/activity";
import { toast } from "react-toastify";
import { TypeErrorResponse } from "@components/types/types";
import Popup from "@components/components/popup/Popup";
import CreateCategory from "./CreateCategory";
import { PlusIcon } from "@heroicons/react/24/solid";

const AddOrEditActivitySchema = z.object({
  name: z.string().min(1, "Name must be at least 1 character"),
  description: z.string().min(1, "Description must be at least 1 character"),
  category: z.string(),
});

const parseDate = (dateString: string): Date => {
  const parsed = new Date(dateString);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
};

type AddOrEditActivityForm = z.infer<typeof AddOrEditActivitySchema> & { startDate: string, endDate: string };

type CreateOrEditActivityDrawerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  editItem?: AddOrEditActivityForm & { id: number };
};

export default function CreateOrEditActivityDrawer({
  open,
  setOpen,
  editItem,
}: CreateOrEditActivityDrawerProps) {
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date>(
    editItem ? parseDate(editItem.startDate) : new Date()
  );
  const [endDate, setEndDate] = useState<Date>(
    editItem ? parseDate(editItem.endDate) : new Date()
  );

  const { data: categories } = activityQuery.query.useGetCategories();
  const { mutate: createActivity } = activityQuery.mutation.useCreateActivity();
  const { mutate: updateActivity } = activityQuery.mutation.useUpdateActivity();

  const categoryOptions = categories?.data?.map((category) => ({
    value: category.id.toString(),
    label: category.name,
  }));

  const { handleSubmit, register, formState, setValue, reset } =
    useForm<AddOrEditActivityForm>({
      defaultValues: {
        name: "",
        description: "",
        category: "",
      },
      resolver: zodResolver(AddOrEditActivitySchema),
    });

  const onSubmit = (data: AddOrEditActivityForm) => {
    if (editItem) {
      updateActivity(
        {
          id: editItem.id,
          name: data.name,
          description: data.description,
          categoryId: +(data.category || 0),
          startedAt: startDate.toISOString(),
          endedAt: endDate.toISOString(),
        },
        {
          onSuccess: (data) => {
            toast(data.message, {
              type: data.isSuccess ? "success" : "error",
            });
            setOpen(false);
          },
          onError: (error: any) => {
            const _error: TypeErrorResponse = error;
            toast(_error.response.data.message, {
              type: "error",
            });
          },
        }
      );
    } else
      createActivity(
        {
          ...data,
          categoryId: +(data.category || 0),
          startedAt: startDate.toISOString(),
          endedAt: endDate.toISOString(),
        },
        {
          onSuccess: (data) => {
            reset();
            toast(data.message, {
              type: data.isSuccess ? "success" : "error",
            });
            setOpen(false);
          },
          onError: (error: any) => {
            const _error: TypeErrorResponse = error;
            toast(_error.response.data.message, {
              type: "error",
            });
          },
        }
      );
  };

  useEffect(() => {
    if (editItem) {
      setValue("name", editItem.name);
      setValue("description", editItem.description);
      setValue("category", editItem.category);
      setStartDate(parseDate(editItem.startDate));
      setEndDate(parseDate(editItem.endDate));
    }
  }, [editItem, setValue]);

  return (
    <Drawer open={open} onClose={() => setOpen(false)}>
      <div>
        <div className="flex items-center justify-between p-6 border-b border-stone-300">
          <p className="text-lg font-semibold">
            {!!editItem ? "Edit" : "Add"} activity
          </p>
          <Button
            className="w-max !m-0"
            name="Save"
            onClick={handleSubmit(onSubmit)}
          />
        </div>
        <form className="grid grid-cols-2 gap-4 p-6">
          <Input
            label="Name"
            name="name"
            placeholder="Name"
            register={register}
            error={formState.errors.name?.message}
            className="col-span-2"
          />

          <Textarea
            label="Description"
            name="description"
            placeholder="Description"
            register={register}
            error={formState.errors.description?.message}
            className="col-span-2"
          />

          <div className="[&>div]:w-full">
            <p className="text-sm font-semibold text-gray-700 mb-1">
              Start date
            </p>
            <DateTimePickerCustom
              id="startDate"
              dateTime={startDate}
              setDateTime={(val) => setStartDate(val)}
            />
          </div>
          <div className="[&>div]:w-full">
            <p className="text-sm font-semibold text-gray-700 mb-1">End date</p>
            <DateTimePickerCustom
              id="endDate"
              dateTime={endDate}
              setDateTime={(val) => setEndDate(val)}
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-1">Category</p>
            <div className="flex items-center gap-2">
              <Select
                name="category"
                register={register}
                placeholder="Select category"
                options={categoryOptions || []}
                error={formState.errors.category?.message}
              />
              <button type="button" onClick={() => setOpenPopup(true)}>
                <PlusIcon className="text-black w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      </div>
      <Popup open={openPopup} title="Create category" setOpen={setOpenPopup}>
        <CreateCategory setOpen={setOpenPopup} />
      </Popup>
    </Drawer>
  );
}
