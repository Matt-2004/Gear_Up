import { TextareaHTMLAttributes } from "react";
import { buildClassName, fillDetailInputBaseClass } from "./shared-index";

export const Textarea = ({
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
