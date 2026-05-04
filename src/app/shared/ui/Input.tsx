"use client";

import { InputHTMLAttributes, ReactNode, forwardRef, useState } from "react";
import { clsx } from "clsx";
import { Eye, EyeOff } from "lucide-react";
import { buildClassName, fillDetailInputBaseClass } from "./shared-index";

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

const AuthInput = forwardRef<HTMLInputElement, Partial<InputProps>>(
  (props, ref) => {
    const {
      type = "email",
      children,
      error,
      name,
      onFocus,
      onBlur,
      ...rest
    } = props;
    const [isTouched, setIsTouched] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Only show error when input is focused and contains value
    const hasValue = String(rest.value || "").length > 0;
    const shouldShowError = error && (isTouched || hasValue);
    const hasErrorProp = "error" in props;

    const inputType = type === "password" && showPassword ? "text" : type;
    const inputId = name;
    return (
      <div className="flex w-full flex-col gap-1">
        <label
          htmlFor={inputId}
          className={clsx(
            "text-sm",
            shouldShowError ? "text-red-500" : "text-gray-500",
          )}
        >
          {children}
        </label>
        <div className="relative w-full flex items-center">
          <input
            id={inputId}
            {...rest}
            ref={ref}
            type={inputType}
            onFocus={(e) => {
              setIsTouched(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsTouched(false);
              onBlur?.(e);
            }}
            className={clsx(
              "w-full focus:ring-primary bg-[#E8E9E0] focus:text-primary rounded-lg border px-4 py-2 text-black placeholder:text-sm placeholder:text-gray-400 focus:ring-1 focus:outline-none focus:placeholder:text-gray-500 transition-colors",
              type === "password" && "pr-10",
              shouldShowError
                ? "border-red-400 bg-red-50/70 text-red-900 placeholder:text-red-300 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/20"
                : "border-gray-200",
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

export default AuthInput;

export const Input = ({
  inputRef,
  leadingIcon,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  inputRef?: React.Ref<HTMLInputElement>;
  leadingIcon?: ReactNode;
}) => {
  return (
    <div className="relative">
      {leadingIcon && (
        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
          {leadingIcon}
        </span>
      )}
      <input
        required
        ref={inputRef}
        {...props}
        className={buildClassName(
          fillDetailInputBaseClass,
          leadingIcon ? "py-1.5 pr-4 pl-9" : "px-4 py-1.5",
          className,
        )}
      />
    </div>
  );
};
