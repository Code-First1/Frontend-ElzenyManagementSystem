import React from "react";

export interface SwitchProps
  extends Omit<React.ComponentPropsWithoutRef<"button">, "onClick"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, checked = false, onCheckedChange, ...props }, ref) => {
    const handleClick = () => {
      onCheckedChange?.(!checked);
    };

    return (
      <button
        type="button"
        role="switch"
        ref={ref}
        aria-checked={checked}
        data-state={checked ? "checked" : "unchecked"}
        className={`peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-switch-background focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 ${
          className || ""
        }`}
        onClick={handleClick}
        {...props}
      >
        <span
          data-state={checked ? "checked" : "unchecked"}
          className="bg-card dark:data-[state=unchecked]:bg-card-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:-translate-x-[calc(100%-1px)] data-[state=unchecked]:translate-x-0"
        />
      </button>
    );
  },
);

Switch.displayName = "Switch";

export { Switch };
