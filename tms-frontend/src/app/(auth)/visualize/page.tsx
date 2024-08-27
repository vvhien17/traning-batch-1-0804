"use client";
import PieChart from "@components/components/chart/PieChart";
import Container from "@components/components/container";
import Select from "@components/components/Select";
import { dashboardQuery } from "@components/hooks/dashboard";
import { useState } from "react";

export default function VisualizePage() {
  const [timeRange, setTimeRange] = useState<"day" | "week">("day");
  const { data: dashboardData } = dashboardQuery.query.useGetDashboard();
  const { data: summaryTimeData, isLoading: loadingSummaryTime } =
    dashboardQuery.query.useGetSummaryTime(timeRange);

  const data = dashboardData?.data.map((item) => ({
    value: item.percentage,
    color:
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0"),
    label: item.name,
  }));

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
                onChange={(e) => {
                  console.log(e.target.value);

                  setTimeRange(e.target.value as "day" | "week");
                }}
              />
            </div>
            <p>
              You spent{" "}
              <span className="text-lg font-semibold text-blue-400">
                {loadingSummaryTime ? (
                  <span className="w-6 h-4 animate-pulse inline-block bg-neutral-400"></span>
                ) : (
                  summaryTimeData?.data.totalHours
                )}{" "}
                hours and{" "}
                {loadingSummaryTime ? (
                  <span className="w-6 h-4 animate-pulse inline-block bg-neutral-400"></span>
                ) : (
                  summaryTimeData?.data.totalMinutes
                )}{" "}
                minutes
              </span>{" "}
              on various activities
            </p>
          </div>
          <div className="border border-neutral-400 rounded-xl p-4 bg-white">
            <p className="text-lg font-semibold mb-6">Time distribution</p>
            <div className="flex items-center gap-6">
              <PieChart data={data || []} />
              <div className="grid gap-3">
                {data?.map((item, index) => (
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
