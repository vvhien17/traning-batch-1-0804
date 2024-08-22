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

const AddOrEditActivitySchema = z.object({
  name: z.string().min(1, "Name must be at least 1 character"),
  description: z.string().min(1, "Description must be at least 1 character"),
  category: z.string(),
});

type AddOrEditActivityForm = z.infer<typeof AddOrEditActivitySchema>;

type CreateOrEditActivityDrawerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  editItem?: AddOrEditActivityForm;
};

export default function CreateOrEditActivityDrawer({
  open,
  setOpen,
  editItem,
}: CreateOrEditActivityDrawerProps) {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  const { handleSubmit, register, formState, setValue } =
    useForm<AddOrEditActivityForm>({
      defaultValues: {
        name: "",
        description: "",
        category: "",
      },
      resolver: zodResolver(AddOrEditActivitySchema),
    });

  const onSubmit = (data: AddOrEditActivityForm) => {
    console.log({ ...data, startDate, endDate });
  };

  useEffect(() => {
    if (editItem) {
      setValue("name", editItem.name);
      setValue("description", editItem.description);
      //   setValue("startDate", editItem.startDate);
      //   setValue("endDate", editItem.endDate);
      setValue("category", editItem.category);
    }
  }, [editItem]);

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
            <Select
              name="category"
              register={register}
              placeholder="Select category"
              options={[
                {
                  value: "1",
                  label: "Category 1",
                },
                {
                  value: "2",
                  label: "Category 2",
                },
              ]}
              error={formState.errors.category?.message}
            />
          </div>
        </form>
      </div>
    </Drawer>
  );
}
