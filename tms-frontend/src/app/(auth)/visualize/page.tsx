import PieChart from "@components/components/chart/PieChart";
import Container from "@components/components/container";
import Select from "@components/components/Select";

export default function VisualizePage() {
  return (
    <div>
      <Container className="pt-10 pb-14">
        <div className="flex justify-between items-center pb-4 mb-6">
          <div className="text-3xl font-bold">Your visualize</div>
        </div>
        <div className="flex items-start gap-4 justify-between [&>*]:flex-1">
          <div className="border border-neutral-400 rounded-xl p-4 bg-white">
            <div className="flex justify-between items-center mb-6">
              <p className="text-lg font-semibold">Summary of time</p>
              <Select
                name="timeRange"
                placeholder="Select category"
                options={[
                  {
                    value: "day",
                    label: "By current day",
                  },
                  {
                    value: "week",
                    label: "By current week",
                  },
                ]}
              />
            </div>
            <p>
              You spent{" "}
              <span className="text-lg font-semibold text-blue-400">
                34 hours
              </span>{" "}
              on various activities
            </p>
          </div>
          <div className="border border-neutral-400 rounded-xl p-4 bg-white">
            <p className="text-lg font-semibold mb-6">Time distribution</p>
            <div className="flex items-center gap-6">
              <PieChart data={data} />
              <div className="grid gap-3">
                {data.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-8 h-4"
                      style={{ backgroundColor: item.color }}
                    />
                    <div>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

const data = [
  { value: 10, color: "#E53E3E", label: "Red Slice" },
  { value: 20, color: "#28b42f", label: "Green Slice" },
  { value: 30, color: "#2680cf", label: "Blue Slice" },
  { value: 40, color: "#f0f369", label: "Yellow Slice" },
];
