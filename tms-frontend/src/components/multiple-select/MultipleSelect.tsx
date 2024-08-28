import React, { useState, useEffect, useRef } from "react";
import classcat from "classcat";
import { useClickOutside } from "@components/hooks";
import { useSearchParams } from "next/navigation";
import queryString from "query-string";

interface MultipleSelectProps {
  label?: string;
  name?: string;
  options?: { value: string; label: string }[];
  selectedValues?: string[];
  onChange?: (selected: string[]) => void;
  error?: string;
  className?: string;
  placeholder?: string;
}

export const MultipleSelect: React.FC<MultipleSelectProps> = ({
  label,
  name,
  options,
  selectedValues = [],
  onChange,
  error,
  className,
  placeholder,
}) => {
  const [selected, setSelected] = useState<string[]>(selectedValues);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const query = queryString.parse(searchParams.toString());
  const { visible, handleToggleVisible, handleCloseVisible } = useClickOutside();

  const handleSelect = (value: string) => {
    let newSelected = [...selected];
    if (newSelected.includes(value)) {
      newSelected = newSelected.filter((v) => v !== value);
    } else {
      newSelected.push(value);
    }
    setSelected(newSelected);
    onChange?.(newSelected);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      handleCloseVisible();
    }
  };

  useEffect(() => {
    if (query.categories) {
      setSelected(Array.isArray(query.categories) ? (query.categories as string[]) : [query.categories]);
    }
  }, [searchParams]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={classcat(["relative min-w-40 max-w-60", className])} ref={dropdownRef}>
      {label && (
        <label htmlFor={name} className="block text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}
      <div
        className="truncate relative block w-full rounded-md border border-gray-300 px-4 py-2 text-sm cursor-pointer"
        onClick={handleToggleVisible}
      >
        <span className="mr-8">
          {selected.length > 0 ? (
            selected.map((val) => options?.find((o) => o.value === val)?.label).join(", ")
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          {visible ? (
            <svg
              className="h-4 w-4 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="h-4 w-4 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </span>
      </div>
      {visible && (
        <div className="absolute left-0 right-0 mt-1 z-10 bg-white border border-gray-300 rounded-md shadow-lg">
          {options?.map((option) => (
            <div
              key={option.value}
              className={classcat([
                "px-4 py-2 text-sm cursor-pointer flex items-center justify-between hover:bg-gray-100",
                { "bg-gray-100": selected.includes(option.value) },
              ])}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
              {selected.includes(option.value) && (
                <svg
                  className="h-4 w-4 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-3.293-3.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          ))}
        </div>
      )}
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
};
