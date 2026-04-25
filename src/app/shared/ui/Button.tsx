"use client";

import clsx from "clsx";
import { ButtonHTMLAttributes, memo } from "react";
import Spinner from "./Spinner";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading: boolean;
  width: "full" | "half";
}

// Button usage
// -> Auth
// -> Profile

// function
// -> Should have "Loading" when click...
//

function Button({
  children,
  loading = false,
  width = "full",
  disabled = false,
  className,
  ...props
}: Partial<ButtonProps>) {
  const isDisabled = Boolean(disabled || loading);

  return (
    <button
      type="submit"
      disabled={isDisabled}
      aria-disabled={isDisabled}
      className={clsx(
        width === "full" ? "min-w-full" : "min-w-[50%]",
        "bg-primary text-white flex w-full items-center justify-center gap-3 rounded-lg px-4 py-2.5 text-base font-semibold tracking-wide shadow-md shadow-primary-200/50 transition-all duration-200 ease-out",
        "hover:cursor-pointer hover:bg-primary-600 hover:shadow-sm ",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2",
        "active:translate-y-0 active:scale-[0.99]",
        "disabled:translate-y-0 disabled:scale-100 disabled:cursor-not-allowed disabled:pointer-events-none disabled:bg-gray-400 disabled:opacity-70 disabled:shadow-none",
        className,
      )}
      {...props}
    >
      {loading && <Spinner />}
      {loading ? "Processing..." : children}
    </button>
  );
}

export default memo(Button);
