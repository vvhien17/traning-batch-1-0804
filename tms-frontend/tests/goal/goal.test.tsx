import GoalPage from "@components/app/(auth)/goal/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

describe("GoalPage", () => {
  const queryClient = new QueryClient();

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <GoalPage />
      </QueryClientProvider>
    );

  it("should render the GoalPage with the correct elements", () => {
    renderComponent();

    const buttonElement = screen.getByRole("button", {
      name: /create new goal/i,
    });
    expect(buttonElement).toBeInTheDocument();
    expect(screen.getByText(/your goal/i)).toBeInTheDocument(); // Update the text matcher
  });

  // it('should show popup when click to add activity button', async () => {
  //     renderComponent()

  //     const buttonElement = screen.getByRole('button', {
  //         name: /create new goal/i
  //     })
  //     const saveButton = screen.getByRole('button', { name: /save/i })
  //     const cancelButton = screen.getByRole('button', { name: /cancel/i })
  //     const nameElement = screen.getByRole('textbox', { name: /name/i })
  //     await userEvent.click(buttonElement)
  //     expect(screen.getByRole('heading', {
  //         name: /create new goal/i
  //     })).toBeInTheDocument()
  //     expect(nameElement).toBeInTheDocument()
  //     expect(saveButton).toBeInTheDocument()
  //     expect(cancelButton).toBeInTheDocument()

  // })

  // it('should action when click button save or cancel', async () => {
  //     renderComponent()

  //     const saveButton = screen.getByRole('button', { name: /save/i })
  //     const cancelButton = screen.getByRole('button', { name: /cancel/i })
  //     await userEvent.click(saveButton)
  //     const toastElement = screen.getByText(/login successfully/i)
  //     expect(toastElement).toBeInTheDocument()

  //     await userEvent.click(cancelButton)
  //     expect(screen.getByRole('heading', {
  //         name: /create new goal/i
  //     })).not.toBeInTheDocument()
  // })

  // it('should render drawer when click on goal items', async () => {
  //     renderComponent();

  //     const itemElement = screen.getAllByRole('button')
  //     await userEvent.click(itemElement[1])

  //     const addNewActivityElement = screen.getByRole('button', {name: /add new activity/i})
  //     expect(screen.getByText(/start date/i)).toBeInTheDocument()
  //     expect(screen.getByText(/end date/i)).toBeInTheDocument()
  //     expect(screen.getByText(/status/i)).toBeInTheDocument()
  //     expect(addNewActivityElement).toBeInTheDocument()
  // })

  // it('should render drawer when click on goal items', async () => {
  //     renderComponent();

  //     const itemElement = screen.getAllByRole('button')
  //     await userEvent.click(itemElement[1])

  //     const addNewActivityElement = screen.getByRole('button', {name: /add new activity/i})
  //     expect(screen.getByText(/start date/i)).toBeInTheDocument()
  //     expect(screen.getByText(/end date/i)).toBeInTheDocument()
  //     expect(screen.getByText(/status/i)).toBeInTheDocument()
  //     expect(addNewActivityElement).toBeInTheDocument()
  // })
});
