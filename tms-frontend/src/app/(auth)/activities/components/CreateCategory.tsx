import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@components/components/Input";
import { activityQuery } from "@components/hooks/activity";
import { toast } from "react-toastify";
import { TypeErrorResponse } from "@components/types/types";

const CreateCategorySchema = z.object({
  name: z.string().min(1, "Name must be at least 1 character"),
});

type CreateCategoryForm = z.infer<typeof CreateCategorySchema>;

export default function CreateCategory({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  const { mutate: createCategory } = activityQuery.mutation.useCreateCategory();

  const { handleSubmit, register, formState, setValue, reset } =
    useForm<CreateCategoryForm>({
      defaultValues: {
        name: "",
      },
      resolver: zodResolver(CreateCategorySchema),
    });

  const onSubmit = (data: CreateCategoryForm) => {
    createCategory(data, {
      onSuccess: (data) => {
        toast(data.message, {
          type: "success",
        });
        setOpen(false);
      },
      onError: (error: any) => {
        const _error: TypeErrorResponse = error;
        toast(_error.response.data.message, {
          type: "error",
        });
      },
    });
  };

  return (
    <div>
      <form>
        <Input
          label="Name"
          name="name"
          placeholder="Name"
          register={register}
          error={formState.errors.name?.message}
          className="col-span-2"
        />
      </form>
      <div className="py-3 flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          className="inline-flex w-full justify-center rounded-md bg-colors-main px-3 py-2 text-sm font-semibold text-white shadow-sm sm:w-auto"
        >
          Save
        </button>
      </div>
    </div>
  );
}
