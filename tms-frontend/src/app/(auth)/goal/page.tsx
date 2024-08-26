"use client";
import Button from "@components/components/button";
import Container from "@components/components/container";
import GoalCard from "./components/GoalCard";

export default function GoalPage() {
  const handleCreateNewGoal = () => {
    console.log("create new goal");
  };

  return (
    <div>
      <Container className="pt-10 pb-14">
        <div className="flex justify-between items-center pb-4 mb-6">
          <div className="text-3xl font-bold">Your goal</div>
          <Button
            className="w-max"
            name="Create new goal"
            onClick={handleCreateNewGoal}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {GOALS.map((item) => (
            <GoalCard key={item.id} {...item} />
          ))}
        </div>
      </Container>
    </div>
  );
}

const GOALS = [
  {
    id: 1,
    name: "Goal 1",
    time: "25/08/2024 - 27/08/2024",
    activities: [
      {
        id: 1,
        name: "Activity 1",
        time: "25/08/2024 - 27/08/2024",
        category: "category 1",
        description: "description 1",
      },
      {
        id: 2,
        name: "Activity 2",
        time: "25/08/2024 - 27/08/2024",
        category: "category 2",
        description: "description 2",
      },
      {
        id: 3,
        name: "Activity 3",
        time: "25/08/2024 - 27/08/2024",
        category: "category 3",
        description: "description 3",
      },
    ],
  },
  {
    id: 2,
    name: "Goal 2",
    time: "25/08/2024 - 27/08/2024",
    activities: [
      {
        id: 1,
        name: "Activity 1",
        time: "25/08/2024 - 27/08/2024",
        category: "category 1",
        description: "description 1",
      },
      {
        id: 2,
        name: "Activity 2",
        time: "25/08/2024 - 27/08/2024",
        category: "category 2",
        description: "description 2",
      },
      {
        id: 3,
        name: "Activity 3",
        time: "25/08/2024 - 27/08/2024",
        category: "category 3",
        description: "description 3",
      },
    ],
  },
];
