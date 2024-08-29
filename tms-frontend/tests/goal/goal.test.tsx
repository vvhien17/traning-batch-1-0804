import GoalPage from "@components/app/(auth)/goal/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

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

  it("should show popup when click to add goal button", async () => {
    renderComponent();

    const buttonElement = screen.getByRole("button", {
      name: /create new goal/i,
    });
    await userEvent.click(buttonElement);
    const saveButton = screen.getByRole("button", { name: /save/i });
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    const nameElement = screen.getByRole("textbox", { name: /name/i });

    expect(
      screen.getByRole("heading", {
        name: /create new goal/i,
      })
    ).toBeInTheDocument();
    expect(nameElement).toBeInTheDocument();
    expect(saveButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
  });

  it("should action when click button cancel", async () => {
    renderComponent();

    const buttonElement = screen.getByRole("button", {
      name: /create new goal/i,
    });
    await userEvent.click(buttonElement);
    const cancelButton = screen.getByRole("button", { name: /cancel/i });

    await userEvent.click(cancelButton);
    expect(
      screen.getByRole("heading", {
        name: /create new goal/i,
      })
    ).toBeInTheDocument();
  });

  // it("should render drawer when click on goal items", async () => {
  //   renderComponent();

  //   const buttonElement = screen.getByText(/what you have to do :/i);
  //   await userEvent.click(buttonElement);
  //   const createActitivtyElement = screen.getByRole("button", {
  //     name: /create new activity/i,
  //   });

  //   expect(screen.getByText(/start date/i)).toBeInTheDocument();
  //   expect(screen.getByText(/end date/i)).toBeInTheDocument();
  //   expect(screen.getByText(/status/i)).toBeInTheDocument();
  //   expect(createActitivtyElement).toBeInTheDocument();
  // });

  // it("should render drawer when click on create new activity on goal detail", async () => {
  //   renderComponent();

  //   const buttonElement = screen.getByText(/what you have to do :/i);
  //   await userEvent.click(buttonElement);
  //   const createActitivtyElement = screen.getByRole("button", {
  //     name: /add new activity/i,
  //   });
  //   await userEvent.click(createActitivtyElement);

  //   expect(screen.getByRole("textbox", { name: /name/i }));
  //   expect(screen.getByRole("textbox", { name: /description/i }));
  //   expect(screen.getByText(/start date/i)).toBeInTheDocument();
  //   expect(screen.getByText(/end date/i)).toBeInTheDocument();
  //   expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  //   expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  // });
});
