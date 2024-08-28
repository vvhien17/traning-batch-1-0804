import React from "react";

interface Props {
  percent: number;
}

const GoalProgress = ({ percent }: Props) => {
  return (
    <div className="relative size-20">
      <svg
        className="size-full -rotate-90"
        viewBox="0 0 36 36"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx={18}
          cy={18}
          r={16}
          fill="none"
          className="stroke-current text-gray-200"
          strokeWidth={2}
        />
        <circle
          cx={18}
          cy={18}
          r={16}
          fill="none"
          className={`stroke-current text-colors-main`}
          strokeWidth={2}
          strokeDasharray={100}
          strokeDashoffset={100 - percent}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
        <span className={`text-center text-lg font-bold text-colors-main`}>
          {Math.round(percent * 10) / 10}%
        </span>
      </div>
    </div>
  );
};

export default GoalProgress;
