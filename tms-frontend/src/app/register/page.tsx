"use client";

import Button from "@components/components/button";
import Container from "@components/components/container";
import Input from "@components/components/Input";
import PATH from "@components/constants/path";
import { authQuery } from "@components/hooks/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";
export type RegisterForm = z.infer<typeof RegisterSchema>;

const RegisterSchema = z
  .object({
    email: z.string().email("Please enter a valid email"),
    username: z.string().min(1, "Please enter username"),
    password: z.string().min(1, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(
        1,
        "Password confirm must be at least 8 characters and match password"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function RegisterPage() {
  const { mutate: registerMutate, isPending } =
    authQuery.mutation.useRegister();

  const { handleSubmit, register, formState, reset } = useForm<RegisterForm>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = (data: RegisterForm) => {
    registerMutate(data, {
      onSuccess: (data) => {
        toast(data.message, {
          type: data.isSuccess ? "success" : "error",
        });
        data.isSuccess && reset();
      },
      onError: (data) => {
        toast(data.message, {
          type: "error",
        });
      },
    });
  };

  return (
    <Container>
      <div className="max-w-80 mt-10 m-auto">
        <div className="p-4 rounded-xl border-stone-300 border-2 bg-stone-100">
          <h2 className="uppercase text-3xl text-center font-bold text-text-title">
            Register
          </h2>

          <form className="mt-6 grid gap-4">
            <Input
              label="Username"
              name="username"
              placeholder="Username"
              register={register}
              error={formState.errors.username?.message}
            />

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

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              register={register}
              error={formState.errors.confirmPassword?.message}
            />
          </form>

          <div className="mt-3 justify-center flex items-center">
            <p className="text-sm">Already have an account?</p>
            <Link
              className="text-sm ml-2 underline decoration-solid decoration-sky-500 text-sky-500"
              href={PATH.login}
            >
              Login
            </Link>
          </div>

          <Button
            name="Register"
            isLoading={isPending}
            onClick={handleSubmit(onSubmit)}
            type="submit"
          />
        </div>
      </div>
    </Container>
  );
}
