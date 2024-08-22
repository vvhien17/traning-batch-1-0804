import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ActivitiesPage from "@components/app/(auth)/activities/page";

describe("ActivitiesPage", () => {
  const queryClient = new QueryClient();

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <ActivitiesPage />
      </QueryClientProvider>
    );

  it("renders the ActivitiesPage with the correct elements", () => {
    renderComponent();

    expect(screen.getByText("Your activities")).toBeInTheDocument();
  });

  it("opens the CreateOrEditActivityDrawer when 'New Activity' button is clicked", () => {
    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: /new activity/i }));

    expect(screen.getByText("Add activity")).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });
});
