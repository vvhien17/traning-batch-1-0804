import React from "react";

interface Props {
  children: React.ReactNode;
}

const Container = ({ children }: Props) => {
  return <div className="px-4 max-w-screen-xl mx-auto">{children}</div>;
};

export default Container;
