type GoalCardProps = {
  name: string;
  time: string;
  activities: {
    id: number;
    name: string;
    time: string;
    category: string;
    description: string;
  }[];
};

export default function GoalCard({ name, time, activities }: GoalCardProps) {
  return (
    <div className="p-4 rounded-xl border border-neutral-400 bg-white">
      <p className="text-xl font-bold mb-2">{name}</p>
      <p className="text-sm text-gray-500 mb-4">{time}</p>
      <div className="grid gap-4">
        {activities.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl border border-neutral-400 bg-white"
          >
            <p className="text-lg font-bold mb-2">{item.name}</p>
            <p className="text-sm text-gray-500 mb-2">{item.time}</p>
            <p className="text-sm text-gray-500">{item.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
