type SeparatorProps = {
  className?: string;
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

function Separator({
  className = "",
  orientation = "horizontal",
  decorative = true,
  ...props
}: SeparatorProps) {
  const accessibilityProps = decorative
    ? { "aria-hidden": true }
    : { role: "separator", "aria-orientation": orientation };

  return (
    <div
      className={`shrink-0 bg-gray-200 dark:bg-gray-800 ${orientation === "horizontal" ? "h-px w-full" : "h-full w-px"} ${className} `}
      {...accessibilityProps}
      {...props}
    />
  );
}

export { Separator };
