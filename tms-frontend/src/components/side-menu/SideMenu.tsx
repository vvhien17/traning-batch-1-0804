import React, { useState } from "react";
import {
  BeakerIcon,
  CogIcon,
  EyeIcon,
  BugAntIcon,
} from "@heroicons/react/24/solid";
import PATH from "@components/constants/path";

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  link: string;
}

export const SideMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const menuItems: MenuItem[] = [
    {
      icon: <BeakerIcon className="size-5 text-black-500" />,
      label: "Activities",
      link: PATH.activities,
    },
    {
      icon: <CogIcon className="size-5 text-black-500" />,
      label: "Visualize",
      link: PATH.activities,
    },
    {
      icon: <EyeIcon className="size-5 text-black-500" />,
      label: "Summary",
      link: PATH.activities,
    },
    {
      icon: <BugAntIcon className="size-5 text-black-500" />,
      label: "Goal Setting",
      link: PATH.activities,
    },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`min-h-screen bg-white shadow-lg ${
        isOpen ? "w-80" : "w-16"
      } transition-width duration-300 relative`}
    >
      <button
        onClick={toggleMenu}
        className="absolute top-4 right-[-12px] bg-white rounded-full px-2 py-1 text-gray-500 shadow-md"
      >
        {isOpen ? "<" : ">"}
      </button>
      <ul className={`${isOpen ? "w-80" : "w-16"} py-1`}>
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={`${isOpen ? "hover:bg-gray-100" : ""} py-4 pl-4`}
          >
            <a
              href={item.link}
              className="flex items-center text-gray-700 hover:text-gray-900"
            >
              <span className="text-2xl">{item.icon}</span>
              {isOpen && <span className="ml-4">{item.label}</span>}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
