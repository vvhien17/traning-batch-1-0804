import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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
    expect(
      screen.getByRole("button", { name: /create new activity/i })
    ).toBeInTheDocument();
  });

  it("opens the add new activity drawer when 'New Activity' button is clicked", () => {
    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: /new activity/i }));

    expect(screen.getByText("Add activity")).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByText(/start date/i)).toBeInTheDocument();
    expect(screen.getByText(/end date/i)).toBeInTheDocument();
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });

  it("opens the edit activity drawer when 'Edit' button in activity card is clicked", () => {
    renderComponent();

    const editButton = screen.getAllByLabelText(/edit activity/i);
    fireEvent.click(editButton[0]);

    expect(screen.getByText("Edit activity")).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByText(/start date/i)).toBeInTheDocument();
    expect(screen.getByText(/end date/i)).toBeInTheDocument();
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });

  it("shows validation errors in the CreateOrEditActivityDrawer when fields are empty", async () => {
    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: /new activity/i }));

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/name must be at least 1 character/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/description must be at least 1 character/i)
      ).toBeInTheDocument();
    });
  });
});
