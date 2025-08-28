import React from "react";
import ReactDOM from "react-dom";

interface PopoverContextType {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

const PopoverContext = React.createContext<PopoverContextType | null>(null);

function usePopoverContext() {
  const context = React.useContext(PopoverContext);
  if (!context) {
    throw new Error(
      "Popover components must be used within a Popover provider",
    );
  }
  return context;
}

function Popover({
  children,
  isOpen,
  setIsOpen,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isOpen &&
        contentRef.current &&
        !contentRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  const contextValue = { isOpen, setIsOpen, triggerRef, contentRef };

  return (
    <PopoverContext.Provider value={contextValue}>
      {children}
    </PopoverContext.Provider>
  );
}

const PopoverTrigger = ({ children }: { children: React.ReactElement }) => {
  const { isOpen, setIsOpen, triggerRef } = usePopoverContext();

  const handleClick = (e: React.MouseEvent) => {
    const childProps = children.props as {
      onClick?: (e: React.MouseEvent) => void;
    };
    if (childProps.onClick) {
      childProps.onClick(e);
    }
    setIsOpen((prev) => !prev);
  };

  const child = React.isValidElement(children)
    ? React.cloneElement(
        children as React.ReactElement<React.HTMLAttributes<HTMLButtonElement>>,
        {
          ...(children.props as object),
          onClick: handleClick,
          "aria-haspopup": "dialog" as const,
          "aria-expanded": isOpen,
          ref: (node: HTMLButtonElement) => {
            if (typeof triggerRef === "object" && triggerRef !== null) {
              (
                triggerRef as React.MutableRefObject<HTMLButtonElement | null>
              ).current = node;
            }
            const { ref } = children as { ref?: React.Ref<HTMLButtonElement> };
            if (typeof ref === "function") {
              ref(node);
            } else if (ref && typeof ref === "object") {
              (
                ref as React.MutableRefObject<HTMLButtonElement | null>
              ).current = node;
            }
          },
        } as React.HTMLAttributes<HTMLButtonElement> & {
          onClick: () => void;
          "aria-haspopup": "dialog";
          "aria-expanded": boolean;
          ref: (node: HTMLButtonElement) => void;
        },
      )
    : children;

  return child;
};

type PopoverContentProps = {
  children: React.ReactNode;
  className?: string;
  sideOffset?: number;
} & React.HTMLAttributes<HTMLDivElement>;

function PopoverContent({
  children,
  className = "",
  sideOffset = 4,
  ...props
}: PopoverContentProps) {
  const { isOpen, triggerRef, contentRef } = usePopoverContext();
  const [position, setPosition] = React.useState({ top: 0, left: 0 });

  React.useEffect(() => {
    if (isOpen && triggerRef.current && contentRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();

      setPosition({
        top: triggerRect.bottom + window.scrollY + sideOffset,
        left:
          triggerRect.left +
          window.scrollX +
          triggerRect.width / 2 -
          contentRect.width / 2,
      });
    }
  }, [isOpen, triggerRef, contentRef, sideOffset]);

  if (!isOpen) {
    return null;
  }

  return ReactDOM.createPortal(
    <div
      ref={contentRef}
      role="dialog"
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
      className={`absolute z-50 w-72 rounded-md border bg-white p-4 shadow-md transition-all duration-200 outline-none ${isOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"} dark:border-gray-700 dark:bg-gray-900 ${className} `}
      {...props}
    >
      {children}
    </div>,
    document.body,
  );
}

export { Popover, PopoverTrigger, PopoverContent };
