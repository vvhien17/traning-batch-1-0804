import RegisterPage, { RegisterForm } from "@components/app/register/page";
import { authQuery } from "@components/hooks/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { toast } from "react-toastify";

jest.mock("react-toastify", () => ({
  toast: jest.fn(),
}));

jest.mock("@components/hooks/auth", () => ({
  authQuery: {
    mutation: {
      useRegister: jest.fn(),
    },
  },
}));

const renderRegisterPage = () => {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <RegisterPage />
    </QueryClientProvider>
  );
};

const ROUTES_REGISTER = `${process.env.API_URL}/users/register`;

const submitRegisterForm = async ({
  confirmPassword,
  email,
  password,
  username,
}: RegisterForm) => {
  fireEvent.input(screen.getByLabelText(/username/i), {
    target: { value: username },
  });
  fireEvent.input(screen.getByLabelText(/email/i), {
    target: { value: email },
  });
  fireEvent.input(screen.getByLabelText("Password"), {
    target: { value: password },
  });
  fireEvent.input(screen.getByLabelText("Confirm Password"), {
    target: { value: confirmPassword },
  });
  fireEvent.click(screen.getByRole("button", { name: /register/i }));

  await waitFor(() => expect(toast));
};
describe("RegisterPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows success message when successful register", async () => {
    const mock = new AxiosMockAdapter(axios);
    mock.onPost(ROUTES_REGISTER).reply(200, {
      data: {
        email: "email@gmail.com",
        username: "test",
        password: "test",
        id: 13,
        createdAt: "2024-08-26T02:14:18.271Z",
        updatedAt: "2024-08-26T02:14:18.271Z",
      },
      message: "Create data success",
      isSuccess: true,
    });

    const mockUseRegister = jest.fn().mockImplementation(() => ({
      mutate: jest.fn().mockImplementation((data, { onSuccess }) => {
        onSuccess({
          message: "Create data success",
          isSuccess: true,
        });
      }),
      isPending: false,
    }));
    (authQuery.mutation.useRegister as jest.Mock).mockImplementation(
      mockUseRegister
    );

    renderRegisterPage();

    await submitRegisterForm({
      username: "validUser",
      email: "validEmail@gmail.com",
      password: "validPassword",
      confirmPassword: "validPassword",
    });

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith("Create data success", {
        type: "success",
      });
    });
  });

  it("shows success message when email exists", async () => {
    const mock = new AxiosMockAdapter(axios);
    mock.onPost(ROUTES_REGISTER).reply(200, {
      data: null,
      message: "Email already exists",
      isSuccess: false,
    });

    const mockUseRegister = jest.fn().mockImplementation(() => ({
      mutate: jest.fn().mockImplementation((data, { onSuccess, onError }) => {
        onError({
          data: null,
          message: "Email already exists",
          isSuccess: false,
        });
      }),
      isPending: false,
    }));
    (authQuery.mutation.useRegister as jest.Mock).mockImplementation(
      mockUseRegister
    );

    renderRegisterPage();

    await submitRegisterForm({
      username: "invalidUser",
      email: "invalidEmail@gmail.com",
      password: "invalidPassword",
      confirmPassword: "invalidPassword",
    });

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith("Email already exists", {
        type: "error",
      });
    });
  });
});
