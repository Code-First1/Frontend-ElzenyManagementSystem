import * as React from "react";
import { X } from "lucide-react";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

function Dialog({ open, onOpenChange, children }: DialogProps) {
  const [isMounted, setIsMounted] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);

  React.useEffect(() => {
    let rafId: number;

    if (open && !isMounted) {
      setIsMounted(true);
      rafId = requestAnimationFrame(() => {
        setIsActive(true);
      });
    } else if (!open && isMounted) {
      setIsActive(false);
      const timer = setTimeout(() => {
        setIsMounted(false);
      }, 300);

      return () => clearTimeout(timer);
    }

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [open, isMounted]);

  const trigger = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.type === DialogTrigger) {
      return React.cloneElement(
        child as React.ReactElement<
          React.ButtonHTMLAttributes<HTMLButtonElement>
        >,
        { onClick: () => onOpenChange(true) },
      );
    }
    return null;
  });

  if (!isMounted) {
    return <>{trigger}</>;
  }

  return (
    <>
      {trigger}
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === DialogContent || child.type === DialogOverlay) {
            return React.cloneElement(
              child as React.ReactElement<{
                open?: boolean;
                onClose?: () => void;
              }>,
              {
                ...(typeof child.props === "object" && child.props !== null
                  ? child.props
                  : {}),
                open: isActive,
                onClose: () => onOpenChange(false),
              },
            );
          }
        }
        return null;
      })}
    </>
  );
}

const DialogTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className = "", children, ...props }, ref) => {
  return (
    <button ref={ref} className={`${className}`} {...props}>
      {children}
    </button>
  );
});

const DialogOverlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { onClose?: () => void; open: boolean }
>(({ className = "", onClose, open, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`fixed inset-0 z-50 min-h-screen bg-black/50 transition-opacity duration-300 ease-in-out ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      } ${className}`}
      onClick={onClose}
      {...props}
    />
  );
});

const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { onClose?: () => void; open: boolean }
>(({ className = "", children, onClose, open, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-white p-6 shadow-lg transition-all duration-300 ease-in-out ${
        open
          ? "translate-y-0 scale-100 opacity-100"
          : "pointer-events-none translate-y-4 scale-95 opacity-0"
      } sm:max-w-lg ${className}`}
      {...props}
    >
      {children}
      <button
        className="absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:outline-none"
        onClick={onClose}
      >
        <X className="h-7 w-7" />
        <span className="sr-only">Close</span>
      </button>
    </div>
  );
});

const DialogHeader = React.forwardRef<
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

const DialogFooter = React.forwardRef<
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

const DialogTitle = React.forwardRef<
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

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className = "", ...props }, ref) => {
  return (
    <p ref={ref} className={`text-sm text-gray-500 ${className}`} {...props} />
  );
});

const DialogClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className = "", children, ...props }, ref) => {
  return (
    <button ref={ref} className={`${className}`} {...props}>
      {children}
    </button>
  );
});

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
};
