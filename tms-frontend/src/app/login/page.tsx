"use client";
import Input from "@components/components/form-items/Input";
import Select from "@components/components/form-items/Select";
import Textarea from "@components/components/form-items/Textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import Drawer from "@components/components/drawer/Drawer";

const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password must be at least 8 characters"),
  description: z.string().optional(),
  role: z.enum(["admin", "user"]).optional(),
});

type LoginForm = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const [open, setOpen] = useState(false);

  const { handleSubmit, register, formState } = useForm<LoginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    console.log(data);
  };

  return (
    <div>
      <form className="mt-6 grid gap-4">
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="Email"
          register={register}
          error={formState.errors.email?.message}
        />
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Password"
          register={register}
          error={formState.errors.password?.message}
        />
        <Textarea
          name="description"
          label="description"
          placeholder="Description"
          register={register}
          error={formState.errors.description?.message}
        />
        <Select
          name="role"
          label="Role"
          options={[
            { value: "admin", label: "Admin" },
            { value: "user", label: "User" },
          ]}
          register={register}
          error={formState.errors.role?.message}
        />
      </form>
      <button onClick={() => setOpen(true)}>Open Drawer</button>

      <Drawer open={open} onClose={() => setOpen(false)}>
        <div>Content</div>
      </Drawer>

      <button
        type="submit"
        className="mt-6 w-full rounded-md bg-indigo-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        onClick={handleSubmit(onSubmit)}
      >
        Login
      </button>
    </div>
  );
}
