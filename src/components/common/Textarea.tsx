function Textarea({
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`focus:border-primary focus:ring-primary/50 border-primary/30 flex min-h-16 w-full resize-none rounded-md border bg-white px-3 py-2 text-base transition-all outline-none placeholder:text-gray-400 focus:ring-3 disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-red-500/20 md:text-sm dark:border-gray-600 dark:bg-gray-800/30 dark:aria-invalid:ring-red-500/40 ${className}`}
      {...props}
    />
  );
}

export { Textarea };
