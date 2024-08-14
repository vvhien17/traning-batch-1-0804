"use client";
import Container from "@components/components/container";
import Input from "@components/components/form-items/Input";
import PATH from "@components/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { authQuery } from "@components/hooks/auth";

const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password must be at least 8 characters"),
});

type LoginForm = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const { mutate: login } = authQuery.mutation.useLogin();

  const { handleSubmit, register, formState } = useForm<LoginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    login(data, {
      onSuccess: (data) => {
        console.log(data);
        console.log("success");
      },
      onError: () => {
        console.log("error");
      },
    });
    console.log(data);
  };

  return (
    <Container>
      <div className="px-96 mt-20">
        <div className="p-4 rounded-xl border-stone-300 border-2 bg-stone-100">
          <h2 className="uppercase text-3xl text-center font-bold text-title">
            Login
          </h2>

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
          </form>

          <div className="mt-3 justify-center flex items-center">
            <p className="text-sm">Don&apos;t have an account?</p>
            <Link
              className="text-sm ml-2 underline decoration-solid decoration-sky-500 text-sky-500"
              href={PATH.register}
            >
              Register
            </Link>
          </div>

          <button
            onClick={handleSubmit(onSubmit)}
            type="submit"
            className="mt-6 w-full rounded-md bg-main py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Login
          </button>
        </div>
      </div>
    </Container>
  );
}
