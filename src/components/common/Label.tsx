function Label({
  className = "",
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={`peer- group-data-[disabled=true]: flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:opacity-50 peer-disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}

export { Label };
