import { cn } from "@/lib/utils/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "success";

export type ButtonSize = "default" | "sm" | "lg" | "icon";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "btn btn-primary",
  secondary: "btn btn-secondary",
  outline: "btn btn-outline",
  ghost: "btn btn-ghost",
  danger: "btn btn-danger",
  success: "btn btn-success",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "",
  sm: "btn-sm",
  lg: "btn-lg",
  icon: "btn-icon",
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  variant = "primary",
  size = "default",
  className,
  type = "button",
  style,
  ...props
}: ButtonProps) {
  const fallbackStyle: React.CSSProperties =
    variant === "primary"
      ? {
          backgroundColor: "#001f54",
          borderColor: "#001f54",
          color: "#ffffff",
        }
      : variant === "secondary" || variant === "outline"
        ? {
            backgroundColor: "#ffffff",
            borderColor: "#d6dee8",
            color: "#001f54",
          }
        : {};

  return (
    <button
      type={type}
      className={cn(variantClasses[variant], sizeClasses[size], className)}
      style={{ ...fallbackStyle, ...style }}
      {...props}
    />
  );
}
