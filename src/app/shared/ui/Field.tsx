import { ReactNode } from "react";
import { buildClassName } from "./shared-index";

export const Field = ({
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
