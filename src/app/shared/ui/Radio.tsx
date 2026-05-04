import { ReactNode } from "react";
import { buildClassName } from "./shared-index";

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

export const RadioSelection = ({
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
