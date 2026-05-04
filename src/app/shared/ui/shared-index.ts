export const fillDetailInputBaseClass =
  "focus:ring-primary py-2  w-full rounded-lg bg-foreground border border-gray-200 text-black transition-all text-sm placeholder:text-gray-500 focus:ring-1 focus:outline-none";

export const buildClassName = (
  ...classNames: Array<string | undefined | false>
) => classNames.filter(Boolean).join(" ");
