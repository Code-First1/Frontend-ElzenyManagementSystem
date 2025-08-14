type LoaderProps = {
  style?: "spinner" | "dots";
  size?: "sm" | "md" | "lg";
  color?: string;
};

function Loader({
  style = "spinner",
  size = "md",
  color = "text-blue-500",
}: LoaderProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  if (style === "dots") {
    const dotSizeClasses = {
      sm: "h-1.5 w-1.5",
      md: "h-2 w-2",
      lg: "h-3 w-3",
    };
    return (
      <div className="flex items-center justify-center space-x-2">
        <div
          className={`${dotSizeClasses[size]} ${color.replace("text-", "bg-")} animate-bounce-1 rounded-full`}
        ></div>
        <div
          className={`${dotSizeClasses[size]} ${color.replace("text-", "bg-")} animate-bounce-2 rounded-full`}
        ></div>
        <div
          className={`${dotSizeClasses[size]} ${color.replace("text-", "bg-")} animate-bounce-3 rounded-full`}
        ></div>
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} border-primary animate-spin rounded-full border-4 border-t-transparent`}
    ></div>
  );
}

export default Loader;
