import { RadioInputContainer } from "@/app/shared/ui/Input";
import { ChevronRight } from "lucide-react";
import { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

const fillDetailInputBaseClass =
  "focus:ring-primary py-2  w-full rounded-lg bg-foreground border border-gray-200 text-black transition-all text-sm placeholder:text-gray-500 focus:ring-1 focus:outline-none";

const buildClassName = (...classNames: Array<string | undefined | false>) =>
  classNames.filter(Boolean).join(" ");

export const FillDetailField = ({
  children,
  className,
  containerRef,
}: {
  children: ReactNode;
  className?: string;
  containerRef?: React.Ref<HTMLDivElement>;
}) => {
  return (
    <div
      ref={containerRef}
      className={buildClassName("flex w-full flex-col gap-1", className)}
    >
      {children}
    </div>
  );
};

export const FillDetailLabel = ({
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

export const FillDetailInput = ({
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

export const FillDetailTextarea = ({
  textareaRef,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & {
  textareaRef?: React.Ref<HTMLTextAreaElement>;
}) => {
  return (
    <textarea
      ref={textareaRef}
      {...props}
      className={buildClassName(
        fillDetailInputBaseClass,
        "resize-none px-4 py-2",
        className,
      )}
    />
  );
};

export const SuggestionDropdown = ({
  items,
  onSelect,
}: {
  items: string[];
  onSelect: (item: string) => void;
}) => {
  if (items.length === 0) return null;

  return (
    <div className="animate-in fade-in slide-in-from-top-2 absolute top-full left-0 z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-xl duration-200">
      <ul className="max-h-60 max-w-full overflow-y-auto py-1">
        {items.map((item, index) => (
          <li
            key={`${item}-${index}`}
            onClick={() => onSelect(item)}
            className="group flex cursor-pointer items-center justify-between border-l-2 border-transparent px-4 py-2.5 text-sm text-gray-700 transition-colors hover:border-primary hover:bg-primary-50 hover:text-primary"
          >
            <span>{item}</span>
            <ChevronRight className="h-4 w-4 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export const RadioGroupField = ({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div className={buildClassName("flex flex-col gap-2", className)}>
      <label className="text-sm font-semibold text-gray-500">
        {label} <span className="text-red-500">*</span>
      </label>
      <RadioInputContainer title="">{children}</RadioInputContainer>
    </div>
  );
};
