import { cn } from "clsx-for-tailwind";
import type { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  name: string;
  type?: "text" | "email" | "tel" | "date" | "select";
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  error?: string;
  disabled?: boolean;
  className?: string;
}

const FormField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder,
  options,
  error,
  disabled = false,
  className
}: FormFieldProps) => {
  const baseInputClasses = cn(
    "w-full px-3 py-2 md:px-4 md:py-3",
    "border border-gray-300 rounded-lg",
    "text-sm md:text-base",
    "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
    "transition-colors duration-200",
    "disabled:bg-gray-100 disabled:cursor-not-allowed",
    error ? "border-red-500 ring-2 ring-red-200" : "",
    className
  );

  const renderInput = () => {
    if (type === "select" && options) {
      return (
        <select
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={baseInputClasses}
          required={required}
        >
          <option value="">{placeholder || "Seleccionar..."}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={baseInputClasses}
      />
    );
  };

  return (
    <div className="space-y-1">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderInput()}
      {error && (
        <p className="text-sm text-red-600 flex items-center mt-1">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

interface FormSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export const FormSection = ({ title, children, className }: FormSectionProps) => {
  return (
    <div className={cn(
      "bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6",
      className
    )}>
      <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">
        {title}
      </h2>
      <div className="space-y-4 md:space-y-6">
        {children}
      </div>
    </div>
  );
};

export default FormField;