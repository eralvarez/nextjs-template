import { HTMLAttributes } from "react";

interface FormActionsContainerProps extends HTMLAttributes<HTMLDivElement> {}

const defaultClasses = "flex justify-end gap-2";
export default function FormActionsContainer({
  className,
  ...restProps
}: FormActionsContainerProps) {
  return (
    <div
      className={`${defaultClasses}${className ? ` ${className}` : ""}`}
      {...restProps}
    />
  );
}
