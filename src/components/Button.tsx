import { ButtonHTMLAttributes } from "react";

type ButtonVariants = "button" | "text";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariants;
  isLoading?: boolean;
}

const defaultClasses = "px-6 py-2 rounded-sm disabled:opacity-75";
const variantClasses: Record<ButtonVariants, string> = {
  button: "bg-gray-700 text-white font-light",
  text: "bg-white text-slate-800",
};
const loadingVariantClasses: Record<ButtonVariants, string> = {
  button: "text-white",
  text: "text-slate-800",
};
export default function Button({
  type = "button",
  variant = "button",
  className,
  isLoading = false,
  children,
  ...restProps
}: Readonly<ButtonProps>) {
  return (
    <button
      className={`${defaultClasses} ${variantClasses[variant]}${
        className ? ` ${className}` : ""
      }`}
      type={type}
      {...restProps}
    >
      {isLoading ? (
        <svg
          className={`animate-spin h-5 w-5 ${loadingVariantClasses[variant]}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        children
      )}
    </button>
  );
}
