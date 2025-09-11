import * as React from "react";
import { ChevronDown } from "lucide-react";

interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

const SelectContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
  value: string;
  setValue: (value: string) => void;
} | null>(null);

function Select({
  value,
  defaultValue,
  onValueChange,
  children,
  className = "",
}: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(
    defaultValue || value || "",
  );
  const selectRef = React.useRef<HTMLDivElement>(null);

  const contextValue = {
    open,
    setOpen,
    value: value || internalValue,
    setValue: (val: string) => {
      setInternalValue(val);
      onValueChange?.(val);
    },
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <SelectContext.Provider value={contextValue}>
      <div className={`relative ${className}`} ref={selectRef}>
        {children}
      </div>
    </SelectContext.Provider>
  );
}

function useSelectContext() {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error("Select components must be used within a Select");
  }
  return context;
}

function SelectTrigger({
  children,
  className = "",
  size = "default",
  disabled,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: "sm" | "default";
}) {
  const { open, setOpen, value } = useSelectContext();

  return (
    <button
      disabled={disabled}
      type="button"
      className={`focus:border-primary focus:ring-primary/50 border-primary/30 flex w-full items-center justify-between gap-2 rounded-md border bg-white px-3 py-2 text-sm whitespace-nowrap text-gray-400 transition-all outline-none focus:ring-2 disabled:opacity-60 dark:bg-gray-800/30 ${
        size === "default" ? "h-9" : "h-8"
      } ${className}`}
      onClick={() => setOpen(!open)}
      {...props}
    >
      <div className="line-clamp-1 flex items-center gap-2">
        {children || value}
      </div>
      <ChevronDown
        className={`h-4 w-4 opacity-50 transition-transform ${
          open ? "rotate-180" : ""
        }`}
      />
    </button>
  );
}

function SelectContent({
  children,
  className = "",
  position = "popper",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  position?: "popper" | "item-aligned";
}) {
  const { open } = useSelectContext();

  if (!open) return null;

  return (
    <div
      className={`animate-in fade-in-0 zoom-in-95 absolute z-50 mt-1 w-full min-w-[8rem] overflow-hidden rounded-md border bg-white shadow-lg ${
        position === "popper" ? "translate-y-1" : ""
      } dark:border-gray-700 dark:bg-gray-800 ${className}`}
      {...props}
    >
      <div className="max-h-60 overflow-y-auto p-1">{children}</div>
    </div>
  );
}

function SelectItem({
  children,
  value,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { value: string }) {
  const { setValue, setOpen } = useSelectContext();

  return (
    <div
      className={`hover:bg-secondary data-[disabled]: relative flex w-full cursor-default cursor-pointer items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none select-none focus:bg-gray-100 data-[disabled]:opacity-50 dark:hover:bg-gray-700 dark:focus:bg-gray-700 ${className}`}
      onClick={() => {
        setValue(value);
        setOpen(false);
      }}
      {...props}
    >
      {children}
    </div>
  );
}

function SelectLabel({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`px-2 py-1.5 text-xs text-gray-500 ${className}`}
      {...props}
    />
  );
}

function SelectSeparator({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLHRElement>) {
  return (
    <hr className={`-mx-1 my-1 h-px bg-gray-200 ${className}`} {...props} />
  );
}

function SelectValue({
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return <span {...props}>{children}</span>;
}

function SelectGroup({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props}>{children}</div>;
}

export {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectValue,
  SelectGroup,
};
