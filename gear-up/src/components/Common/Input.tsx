import { InputHTMLAttributes, ReactNode } from "react";

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
    | "month";

  children: ReactNode;
}

export default function Input({
  type = "email",
  children,
  ...props
}: Partial<InputProps>) {
  return (
    <div className="flex w-full flex-col gap-1">
      <label className="text-sm font-semibold text-gray-500">{children}</label>
      <input
        {...props}
        type={type}
        className="focus:ring-primary focus:text-primary rounded-lg border border-gray-200 px-4 py-1.5 text-black placeholder:text-sm placeholder:text-gray-400 focus:bg-[#BAFFAF] focus:ring-1 focus:outline-none focus:placeholder:text-gray-500"
      />
    </div>
  );
}

export const RadioInputContainer = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  return (
    <section className="flex w-full flex-col items-start justify-center gap-2">
      <h1 className="text-sm font-semibold text-gray-500">{title}</h1>
      <div className="flex w-full justify-between gap-2">{children}</div>
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
    <label className="has-[:checked]:border-primary has-[:checked]:text-primary flex w-full max-w-[25rem] flex-1 cursor-pointer items-center justify-center rounded-lg border border-gray-300 px-4 py-1 text-gray-400 has-[:checked]:bg-green-200">
      <input
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
