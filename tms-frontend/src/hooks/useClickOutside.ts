import { useEffect, useState } from "react";
import { useRef } from "react";

export const useClickOutside = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const ref = useRef<HTMLElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggleVisible = () => {
    setVisible(!visible);
  };

  const handleCloseVisible = () => {
    setVisible(false);
  };

  return {
    visible,
    handleToggleVisible,
    handleCloseVisible,
  };
};
