import { ChevronRight } from "lucide-react";

export const Dropdown = ({
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
