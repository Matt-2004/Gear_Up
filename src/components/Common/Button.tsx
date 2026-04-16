"use client";

import clsx from "clsx";
import { ButtonHTMLAttributes, memo } from "react";
import Spinner from "./Spinner";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading: boolean;
  width: "full" | "half";
  disable?: boolean;
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
  disable = false,
  disabled = false,
  ...props
}: Partial<ButtonProps>) {
  const isDisabled = Boolean(disable || disabled || loading);

  return (
    <button
      type="submit"
      disabled={isDisabled}
      aria-disabled={isDisabled}
      className={clsx(
        width === "full" ? "min-w-full" : "min-w-[50%]",
        "bg-primary-500 font-semibold active:bg-primary-500 flex w-full items-center justify-center gap-4 sm:gap-4 md:gap-6 rounded-md py-2.5 sm:py-3 md:py-3 px-4 sm:px-6 md:px-8 text-base sm:text-base md:text-lg text-white transition-shadow hover:cursor-pointer hover:shadow-sm shadow-primary-200",
        "disabled:bg-gray-400 disabled:opacity-70 disabled:cursor-not-allowed disabled:pointer-events-none disabled:shadow-none disabled:hover:shadow-none disabled:hover:bg-gray-400",
      )}
      {...props}
    >
      {loading && <Spinner />}
      {loading ? "Processing..." : children}
    </button>
  );
}

export default memo(Button);
