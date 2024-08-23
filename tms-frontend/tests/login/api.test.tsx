import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginPage from "@components/app/login/page";
import { toast } from "react-toastify";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { authQuery } from "@components/hooks/auth";
import PATH from "@components/constants/path";

// Mock dependencies
jest.mock("react-toastify", () => ({
  toast: jest.fn(),
}));

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock("@components/hooks/auth", () => ({
  authQuery: {
    mutation: {
      useLogin: jest.fn(),
    },
  },
}));

// Helper function to render LoginPage with QueryClientProvider
const renderLoginPage = () => {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <LoginPage />
    </QueryClientProvider>
  );
};

// Helper function to fill out and submit the form
const submitLoginForm = async (email: string, password: string) => {
  fireEvent.input(screen.getByLabelText(/email/i), {
    target: { value: email },
  });
  fireEvent.input(screen.getByLabelText(/password/i), {
    target: { value: password },
  });
  fireEvent.click(screen.getByRole("button", { name: /login/i }));

  await waitFor(() => expect(toast).toBeCalled()); // Ensure toast is called
};

describe("LoginPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows error message when email or password is wrong", async () => {
    const mock = new AxiosMockAdapter(axios);
    mock.onPost(`${process.env.API_URL}/auth/login`).reply(401, {
      message: "username or password incorrect",
      error: "Unauthorized",
      statusCode: 401,
    });

    const mockUseLogin = jest.fn().mockImplementation(() => ({
      mutate: jest.fn().mockImplementation((data, { onSuccess, onError }) => {
        onError({
          response: {
            data: {
              message: "username or password incorrect",
              error: "Unauthorized",
              statusCode: 401,
            },
          },
        });
      }),
      isPending: false,
    }));
    (authQuery.mutation.useLogin as jest.Mock).mockImplementation(mockUseLogin);

    renderLoginPage();
    await submitLoginForm("invalid@example.com", "invalidpassword");

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith("username or password incorrect", {
        type: "error",
      });
    });
  });

  it("shows success message and redirects on successful login", async () => {
    const mock = new AxiosMockAdapter(axios);
    mock.onPost(`${process.env.API_URL}/auth/login`).reply(200, {
      data: {
        access_token: "mockAccessToken",
        user: { id: 1, name: "John Doe" },
      },
      message: "Login successful",
    });

    const mockUseLogin = jest.fn().mockImplementation(() => ({
      mutate: jest.fn().mockImplementation((data, { onSuccess }) => {
        onSuccess({
          data: {
            access_token: "mockAccessToken",
            user: { id: 1, name: "John Doe" },
          },
          message: "Login successful",
        });
      }),
      isPending: false,
    }));
    (authQuery.mutation.useLogin as jest.Mock).mockImplementation(mockUseLogin);

    renderLoginPage();
    await submitLoginForm("valid@example.com", "validpassword");

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith("Login successful", {
        type: "success",
      });
      expect(mockPush).toHaveBeenCalledWith(PATH.activities);
    });
  });
});
