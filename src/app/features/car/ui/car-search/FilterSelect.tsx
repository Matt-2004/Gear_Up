import { ChevronDown } from "lucide-react";
import { useId } from "react";

export function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  const id = useId();

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-zinc-200 bg-white py-2 pl-3 pr-8 text-sm font-medium text-zinc-900 transition-all hover:border-zinc-300 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/10"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
      </div>
    </div>
  );
}
