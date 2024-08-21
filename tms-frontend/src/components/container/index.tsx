import React from "react";
import classcat from "classcat";

interface Props {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, className }: Props) => {
  return <div className={classcat(["px-4 max-w-screen-xl w-full mx-auto", className])}>{children}</div>;
};

export default Container;
