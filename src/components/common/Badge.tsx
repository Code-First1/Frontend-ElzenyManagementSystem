import * as React from "react";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  asChild?: boolean;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = "", variant = "default", asChild = false, ...props }, ref) => {
    const baseClasses =
      "inline-flex items-center justify-center rounded-md border px-2 py-0.5  font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]: focus-visible:border-blue-500 focus-visible:ring-blue-500/50 focus-visible:ring-[3px] aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500 transition-all overflow-hidden";

    const variantClasses = {
      default: "border-transparent bg-primary text-white hover:bg-primary/90",
      secondary: "border-transparent bg-secondary  hover:bg-secondary-200/90",
      destructive:
        "border-transparent bg-red-600 text-white hover:bg-red-600/90 focus-visible:ring-red-500/20 dark:focus-visible:ring-red-500/40 dark:bg-red-600/60",
      outline: "border-gray-300 text-gray-800 hover:bg-secondary",
    };

    const Comp = asChild ? React.Fragment : "span";

    return (
      <Comp
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        {...props}
      />
    );
  },
);

Badge.displayName = "Badge";

export { Badge };
