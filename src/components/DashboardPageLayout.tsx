import { HtmlHTMLAttributes } from "react";

interface DashboardPageProps extends HtmlHTMLAttributes<HTMLDivElement> {}

const defaultClasses = "flex flex-col gap-4";
export default function DashboardPageLayout({
  className,
  ...restProps
}: DashboardPageProps) {
  return (
    <div
      className={`${defaultClasses}${className ? ` ${className}` : ""}`}
      {...restProps}
    />
  );
}
