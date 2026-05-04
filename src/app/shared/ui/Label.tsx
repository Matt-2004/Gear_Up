import { ReactNode } from "react";
import { buildClassName } from "./shared-index";

export const Label = ({
  label,
  required = false,
  helper,
  rightContent,
  className,
}: {
  label: string;
  required?: boolean;
  helper?: ReactNode;
  rightContent?: ReactNode;
  className?: string;
}) => {
  if (rightContent) {
    return (
      <label
        className={buildClassName(
          "flex items-center justify-between text-sm font-semibold text-primary",
          className,
        )}
      >
        <span className="flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
          {helper}
        </span>
        {rightContent}
      </label>
    );
  }

  return (
    <label
      className={buildClassName(
        "flex items-center gap-1 text-sm font-semibold text-primary",
        className,
      )}
    >
      {label}
      {required && <span className="text-red-500">*</span>}
      {helper}
    </label>
  );
};
