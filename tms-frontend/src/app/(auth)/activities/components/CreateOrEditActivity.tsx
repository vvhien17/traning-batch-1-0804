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
  startDate: z.string(),
  endDate: z.string(),
}).refine(
  (data) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);

    const startDateOnly = start.toISOString().split("T")[0];
    const endDateOnly = end.toISOString().split("T")[0];

    return startDateOnly === endDateOnly;
  },
  {
    message: "Start Date and End Date must be on the same day",
    path: ["endDate"],
  }
)
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return start < end;
    },
    {
      message: "Start Date must be before End Date",
      path: ["endDate"],
    }
  );

const parseDate = (dateString: string): Date => {
  const parsed = new Date(dateString);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
};

type AddOrEditActivityForm = z.infer<typeof AddOrEditActivitySchema>;

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

  const { handleSubmit, register, formState, setValue, reset, trigger } =
    useForm<AddOrEditActivityForm>({
      defaultValues: {
        name: "",
        description: "",
        category: "",
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
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
          categoryId: data.category ? +data.category : undefined,
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
          name: data.name,
          description: data.description,
          categoryId: data.category ? +data.category : undefined,
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
      setValue("category", editItem.category.toString());
      setStartDate(parseDate(editItem.startDate));
      setEndDate(parseDate(editItem.endDate));
    }
  }, [editItem, setValue]);

  const handleDateChange = (field: 'startDate' | 'endDate', date: Date) => {
    if (field === 'startDate') {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
    setValue(field, date.toISOString());
    trigger(field);
  };

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
              setDateTime={(val) => handleDateChange('startDate', val)}
            />
          </div>
          <div className="[&>div]:w-full">
            <p className="text-sm font-semibold text-gray-700 mb-1">End date</p>
            <DateTimePickerCustom
              id="endDate"
              dateTime={endDate}
              setDateTime={(val) => handleDateChange('endDate', val)}
            />
            {formState.errors.endDate && (
              <p className="text-red-500 text-sm mt-1">{formState.errors.endDate.message}</p>
            )}
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
