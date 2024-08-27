import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ActivitiesPage from "@components/app/(auth)/activities/page";
import userEvent from "@testing-library/user-event";
import { TStatus } from "@components/components/card-activity/CardActivity";
import { CardActivity } from "@components/components/card-activity";
import CreateOrEditActivityDrawer from "@components/app/(auth)/activities/components/CreateOrEditActivity";
import queryString from 'query-string';

jest.mock('query-string', () => ({
  parse: jest.fn().mockReturnValue({ categories: "leisure" }),
  stringify: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: () => [new URLSearchParams("revalidate=1&categories=leisure")],
}));

describe("ActivitiesPage", () => {
  const queryClient = new QueryClient();

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnOpen = jest.fn();

  const mockCardActivityProps = {
    id: 1,
    title: "Sample Activity",
    description: "This is a sample activity description.",
    startedAt: "2024-08-26T08:30:00Z",
    endedAt: "2024-08-26T10:30:00Z",
    categoryName: "Leisure",
    status: "completed" as TStatus,
    onEdit: mockOnEdit,
    onDelete: mockOnDelete,
  };

  const mockEditActivityDrawerProps = {
    open: true,
    setOpen: mockOnOpen,
    editItem: {
      id: 1,
      name: 'Doing homework',
      description: 'Description....',
      category: 'Daily',
      startDate: '2024-08-21T08:00:00.000Z',
      endDate: '2024-08-28T15:00:00.000Z'
    }
  };

  beforeEach(() => {
    mockOnEdit.mockClear();
    mockOnDelete.mockClear();
    mockOnOpen.mockClear();
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <ActivitiesPage />
      </QueryClientProvider>
    );
  const renderDetailComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <CardActivity {...mockCardActivityProps} />
        <CreateOrEditActivityDrawer {...mockEditActivityDrawerProps} />
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

  it("opens the edit activity drawer when 'Edit' button in activity card is clicked", async () => {
    renderDetailComponent()

    const editButton = screen.getByRole('button', { name: /edit activity/i });
    await userEvent.click(editButton);

    expect(screen.getByText(/edit activity/i)).toBeInTheDocument();
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
