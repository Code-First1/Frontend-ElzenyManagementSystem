import * as React from "react";

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const AlertDialogContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

function AlertDialog({ open, onOpenChange, children }: AlertDialogProps) {
  const [isVisible, setIsVisible] = React.useState(open);
  const dialogRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (open) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Close when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(event.target as Node)
      ) {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onOpenChange]);

  return (
    <AlertDialogContext.Provider value={{ open, setOpen: onOpenChange }}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === AlertDialogTrigger) {
            return React.cloneElement(
              child as React.ReactElement<
                React.ButtonHTMLAttributes<HTMLButtonElement>
              >,
              {
                onClick: () => onOpenChange(true),
              },
            );
          }
          if (
            isVisible &&
            (child.type === AlertDialogContent ||
              child.type === AlertDialogOverlay)
          ) {
            return React.cloneElement(
              child as React.ReactElement<{
                open: boolean;
                onClose: () => void;
              }>,
              {
                open,
                onClose: () => onOpenChange(false),
              },
            );
          }
        }
        return null;
      })}
    </AlertDialogContext.Provider>
  );
}

const AlertDialogTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className = "", children, ...props }, ref) => {
  return (
    <button ref={ref} className={`${className}`} {...props}>
      {children}
    </button>
  );
});

const AlertDialogOverlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { onClose: () => void; open: boolean }
>(({ className = "", onClose, open, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`fixed inset-0 z-50 m-0 w-full bg-black/50 transition-opacity duration-300 ease-in-out ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      } ${className}`}
      onClick={onClose}
      {...props}
    />
  );
});

const AlertDialogContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { onClose: () => void; open: boolean }
>(({ className = "", children, open, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-white p-6 shadow-lg transition-all duration-300 ease-in-out ${
        open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

const AlertDialogHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = "", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`flex flex-col gap-2 text-center sm:text-left ${className}`}
      {...props}
    />
  );
});

const AlertDialogFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = "", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`flex flex-col-reverse gap-2 sm:flex-row sm:justify-end ${className}`}
      {...props}
    />
  );
});

const AlertDialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className = "", ...props }, ref) => {
  return (
    <h2
      ref={ref}
      className={`text-lg leading-none font-semibold ${className}`}
      {...props}
    />
  );
});

const AlertDialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className = "", ...props }, ref) => {
  return <p ref={ref} className={`text-gray-500 ${className}`} {...props} />;
});

const AlertDialogAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className = "", children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={`rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

const AlertDialogCancel = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className = "", children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={`hover:bg-secondary rounded-md px-4 py-2 text-sm font-medium shadow-sm transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
