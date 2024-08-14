import React, { ButtonHTMLAttributes } from "react";
import classcat from "classcat";
import Loader from "../loader";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  isLoading?: boolean;
  onClick: () => void;
  name: string;
}

const Button = ({
  className,
  isLoading,
  onClick,
  type = "button",
  name,
}: Props) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={classcat([
        "flex items-center justify-center gap-2 mt-6 w-full rounded-md bg-main py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
        ,
        className,
        isLoading && "opacity-50",
      ])}
      disabled={isLoading}
    >
      {isLoading && <Loader />}
      {name}
    </button>
  );
};

export default Button;
