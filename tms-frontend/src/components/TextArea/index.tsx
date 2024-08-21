import React from "react";
import classcat from "classcat";

// Define the props for the Textarea component
interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  name?: string;
  register?: any;
  placeholder?: string;
  error?: string;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  name,
  placeholder,
  register,
  error,
  className,
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
      <textarea
        id={name}
        className="block w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
        placeholder={placeholder}
        {...register?.(name)}
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Textarea;
