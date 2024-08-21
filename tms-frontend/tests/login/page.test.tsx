import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginPage from "@components/app/login/page";

describe("LoginPage", () => {
  it("renders the login form with email and password fields", () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <LoginPage />
      </QueryClientProvider>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("shows validation errors when fields are empty and submit is clicked", async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <LoginPage />
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(
      await screen.findByText(/please enter a valid email/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/password must be at least 8 characters/i)
    ).toBeInTheDocument();
  });
});
