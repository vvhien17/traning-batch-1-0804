import React from "react";
import classcat from "classcat";

// Define the props for the Select component
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  name?: string;
  register?: any;
  error?: string;
  options: { value: string; label: string }[];
}

const Select: React.FC<SelectProps> = ({
  label,
  name,
  register,
  error,
  className,
  options,
  ...props
}) => {
  return (
    <div className={classcat(["grid gap-2", className])}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-semibold text-gray-700"
        >
          {label}
        </label>
      )}
      <select
        id={name}
        className="block w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
        {...register?.(name)}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Select;
