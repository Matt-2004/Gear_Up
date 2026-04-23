"use client";

import { InputHTMLAttributes, ReactNode, forwardRef, useState } from "react";
import { clsx } from "clsx";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type:
    | "email"
    | "password"
    | "text"
    | "checkbox"
    | "date"
    | "tel"
    | "number"
    | "file"
    | "month"
    | "Checkbox"
    | "time";

  children: ReactNode;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, Partial<InputProps>>(
  (props, ref) => {
    const { type = "email", children, error, onFocus, onBlur, ...rest } = props;
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Only show error when input is focused and contains value
    const hasValue = String(rest.value || "").length > 0;
    const shouldShowError = error && isFocused && hasValue;
    const hasErrorProp = "error" in props;

    const inputType = type === "password" && showPassword ? "text" : type;

    return (
      <div className="flex w-full flex-col gap-1">
        <label
          className={clsx(
            "text-sm",
            shouldShowError ? "text-red-500" : "text-gray-500",
          )}
        >
          {children}
        </label>
        <div className="relative w-full flex items-center">
          <input
            {...rest}
            ref={ref}
            type={inputType}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            className={clsx(
              "w-full focus:ring-primary bg-[#E8E9E0] focus:text-primary rounded-lg border px-4 py-2 text-black placeholder:text-sm placeholder:text-gray-400 focus:ring-1 focus:outline-none focus:placeholder:text-gray-500 transition-colors",
              type === "password" && "pr-10",
              shouldShowError
                ? "border-red-500 bg-red-50 focus:bg-red-50"
                : "border-gray-200 ",
            )}
          />
          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
        {hasErrorProp && (
          <div className="">
            {shouldShowError && (
              <p className="text-xs font-medium text-red-500">{error}</p>
            )}
          </div>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export default Input;

export const RadioInputContainer = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
  error?: string;
}) => {
  return (
    <section className="flex w-full flex-col items-start justify-center">
      <h1 className="text-sm font-semibold text-gray-500">{title}</h1>
      <div className="flex w-full justify-between bg-[#E8E9E0] rounded-lg">
        {children}
      </div>
    </section>
  );
};

export const RadioInput = ({
  children,
  name,
  value,
  defaultChecked,
}: {
  children: ReactNode;
  name: string;
  value: string | number;
  defaultChecked?: boolean;
}) => {
  return (
    <label className="has-checked:border-primary has-checked:text-white flex w-full max-w-100 flex-1 cursor-pointer items-center text-center justify-center rounded-lg  px-4 py-2 text-gray-400 has-checked:bg-primary">
      <input
        required
        name={name}
        value={value}
        type="radio"
        defaultChecked={defaultChecked}
        className="sr-only"
      />
      {children}
    </label>
  );
};
