import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RegisterPage from "@components/app/register/page";

describe("RegisterPage", () => {
  beforeEach(() => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <RegisterPage />
      </QueryClientProvider>
    );
  });

  it("renders the registration form with all fields", () => {
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /register/i })
    ).toBeInTheDocument();
  });

  it("shows validation errors for empty fields on submit", async () => {
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/password must be at least 8 characters/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /password confirm must be at least 8 characters and match password/i
        )
      ).toBeInTheDocument();
    });
  });

  it("shows validation error when email is invalid", async () => {
    fireEvent.input(screen.getByLabelText("Email"), {
      target: { value: "invalidemail" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email/i)
      ).toBeInTheDocument();
    });
  });

  it("shows validation error when passwords do not match", async () => {
    fireEvent.input(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.input(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.input(screen.getByLabelText(/confirm password/i), {
      target: { value: "differentpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument();
    });
  });
});
