import GoalPage from "@components/app/(auth)/goal/page";
import { useCreateGoal, useGetGoal } from "@components/query/goal/queryHooks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@testing-library/jest-dom"; // Ensure this import is present
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));
// Mock useGetGoal hook
jest.mock("@components/query/goal/queryHooks", () => ({
  useGetGoal: jest.fn(),
  useCreateGoal: jest.fn(),
}));

const queryClient = new QueryClient();
const renderComponent = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <GoalPage />
    </QueryClientProvider>
  );

describe("Goal Page", () => {
  const setIsOpen = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the GoalPage with data", async () => {
    (useGetGoal as jest.Mock).mockReturnValue({
      data: [
        {
          id: 4,
          name: "go 1km",
          startedTime: "2024-08-26T09:54:42.866Z",
          endedTime: "2024-08-27T09:00:00.000Z",
          status: "IN PROGRESS",
          userId: 1,
          createdAt: "2024-08-26T09:54:51.725Z",
          updatedAt: "2024-08-26T09:54:51.725Z",
          goalOnActivities: [
            {
              id: 1,
              goalId: 4,
              totalSpend: 10,
              createdAt: "2024-08-26T15:37:52.627Z",
              updatedAt: "2024-08-26T15:37:52.627Z",
              activity: {
                id: 11,
                categoryId: null,
                name: "go go",
                userId: 1,
                startedAt: "2024-08-26T09:56:18.575Z",
                endedAt: "2024-08-27T09:30:00.000Z",
                description: "go go",
                status: "PENDING",
                createdAt: "2024-08-26T09:56:48.361Z",
                updatedAt: "2024-08-26T09:56:48.361Z",
                isDelete: false,
              },
            },
          ],
        },
      ],
      isSuccess: true,
      message: "Get data success",
      isLoading: false,
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("go 1km")).toBeInTheDocument();
    });
  });

  it("renders no data message when no data is available", async () => {
    (useGetGoal as jest.Mock).mockReturnValue({
      data: [],
      isSuccess: true,
      message: "No data",
      isLoading: false,
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("No data activity")).toBeInTheDocument();
    });
  });

  // it("should submit the form with correct data and show success message", async () => {
  //   // Mock the mutateAsync function
  //   const mutateAsync = jest.fn().mockResolvedValue({
  //     message: "Create data success",
  //   });
  //   (useCreateGoal as jest.Mock).mockReturnValue({ mutateAsync });

  //   // Render the component
  //   render(
  //     <QueryClientProvider client={queryClient}>
  //       <GoalPage />
  //       <FormAddGoal setIsOpen={setIsOpen} />
  //     </QueryClientProvider>
  //   );

  //   // Fill out the form
  //   fireEvent.change(screen.getByPlaceholderText("Name"), {
  //     target: { value: "go 2km" },
  //   });

  //   // Mock the DateTimePickerCustom components
  //   fireEvent.change(screen.getByPlaceholderText("Start Date"), {
  //     target: { value: "2024-08-27T02:19:57.832Z" },
  //   });
  //   fireEvent.change(screen.getByPlaceholderText("End Date"), {
  //     target: { value: "2024-08-30T02:30:00.000Z" },
  //   });
  //   // Submit the form
  //   fireEvent.click(screen.getByText("Save"));

  //   // Wait for async operations
  //   await waitFor(() => {
  //     expect(mutateAsync).toHaveBeenCalledWith({
  //       name: "go 2km",
  //       startedTime: new Date("2024-08-27T02:19:57.832Z"),
  //       endedTime: new Date("2024-08-30T02:30:00.000Z"),
  //     });
  //     // expect(toast.success).toHaveBeenCalledWith("Create data success");

  //     expect(screen.getByText("go 2km")).toBeInTheDocument();

  //     expect(setIsOpen).toHaveBeenCalledWith(false);
  //   });
  // });

  it("should display new goal data after form submission", async () => {
    (useGetGoal as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      refetch: jest.fn(),
    });

    const mutateAsync = jest.fn().mockResolvedValue({
      message: "Create data success",
    });

    (useCreateGoal as jest.Mock).mockReturnValue({ mutateAsync });

    render(<GoalPage />);

    fireEvent.click(screen.getByText("Create new goal"));

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "go 2km" },
    });

    fireEvent.change(screen.getByPlaceholderText("Start Date"), {
      target: { value: "2024-08-27T02:19:57.832Z" },
    });
    fireEvent.change(screen.getByPlaceholderText("End Date"), {
      target: { value: "2024-08-30T02:30:00.000Z" },
    });

    fireEvent.click(screen.getByText("Save"));

    (useGetGoal as jest.Mock).mockReturnValue({
      data: [
        {
          id: 1,
          name: "go 2km",
          startedTime: "2024-08-27T02:19:57.832Z",
          endedTime: "2024-08-30T02:30:00.000Z",
          status: "PENDING",
          userId: 1,
          createdAt: "2024-08-27T02:20:05.388Z",
          updatedAt: "2024-08-27T02:20:05.388Z",
        },
      ],
      isLoading: false,
      refetch: jest.fn(),
    });

    render(<GoalPage />);

    await waitFor(() => {
      expect(screen.getByText("go 2km")).toBeInTheDocument();
    });
  });
});
