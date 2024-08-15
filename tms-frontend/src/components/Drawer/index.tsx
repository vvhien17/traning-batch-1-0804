"use client";
import classcat from "classcat";
import { useRef } from "react";

type Props = {
  open: boolean;
  children: React.ReactNode;
  className?: string;
  hasOverlay?: boolean;
  onClose: () => void;
};

function Content({
  open,
  onClose,
  children,
  hasOverlay = true,
  className,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleRemoveDOM = () => {
    setTimeout(() => {
      onClose();
    }, 500);
  };

  return (
    <div className={className}>
      {hasOverlay && (
        <div
          className="fixed inset-0 z-10 bg-black opacity-50"
          onClick={handleRemoveDOM}
        />
      )}
      <div
        ref={wrapperRef}
        className={classcat([
          "w-[60%] fixed top-0 right-0 h-screen overscroll-y-auto bg-white z-20",
          open ? "animate-slideIn" : "animate-slideOut",
        ])}
      >
        {children}
      </div>
    </div>
  );
}

export default function Drawer(props: Props) {
  return props.open ? <Content {...props} /> : null;
}
