function Input({
  className = "",
  type = "text",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      className={`focus:border-primary focus:ring-primary/50 flex h-9 w-full min-w-0 rounded-md border border-gray-300 bg-white px-3 py-1 text-base transition-all outline-none selection:bg-blue-500 selection:text-white file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-current placeholder:text-gray-400 focus:ring-3 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-red-500/20 dark:border-gray-600 dark:bg-gray-800/30 dark:aria-invalid:ring-red-500/40 ${className}`}
      {...props}
    />
  );
}

export { Input };
