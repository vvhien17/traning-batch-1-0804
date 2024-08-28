"use client";

import React, { useEffect, useState } from "react";
import Button from "@components/components/button";
import { ListContent } from "./components";
import Container from "@components/components/container";
import { MultipleSelect } from "@components/components/multiple-select";
import CreateOrEditActivityDrawer from "./components/CreateOrEditActivity";
import { activityQuery } from "@components/hooks/activity";
import { useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";

interface DetailsOption {
  value: string;
  label: string;
}

export default function ActivitiesPage() {
  const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const { data: categories } = activityQuery.query.useGetCategories();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = queryString.parse(searchParams.toString());

  const handleSelectChange = (selected: string[]) => {
    setSelectedOptions(selected);
    const newQuery = { ...query, categories: selected };
    router.push(`?${queryString.stringify(newQuery)}`);
  };

  const handleCreateNewActivity = () => {
    setOpen(true);
  };

  const categoryOptions: DetailsOption[] | undefined = categories?.data?.map(
    (category) => ({
      value: category.id.toString(),
      label: category.name,
    })
  );

  useEffect(() => {
    const query = queryString.parse(searchParams.toString());

    if (query.categories) {
      setSelectedOptions(
        Array.isArray(query.categories)
          ? (query.categories as string[])
          : [query.categories]
      );
    }
  }, [searchParams]);

  return (
    <div>
      <Container className="pt-10 pb-14">
        <div className="flex justify-between items-center pb-4 mb-6">
          <div className="text-3xl font-bold">Your activities</div>
          <div className="flex justify-center items-end gap-2">
            <MultipleSelect
              label="Filter categories"
              name="exampleSelect"
              options={categoryOptions}
              selectedValues={selectedOptions}
              onChange={handleSelectChange}
              placeholder="Please select options"
            />
            <Button
              className="w-max"
              name="Create new activity"
              onClick={handleCreateNewActivity}
            />
          </div>
        </div>
        <ListContent />
      </Container>
      <CreateOrEditActivityDrawer open={open} setOpen={setOpen} />
    </div>
  );
}
