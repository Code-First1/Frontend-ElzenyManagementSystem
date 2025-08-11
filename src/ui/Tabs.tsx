import React, { createContext, useContext, useState } from "react";

interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export function Tabs({
  defaultValue,
  children,
  className = "",
}: {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={`flex flex-col gap-6 ${className}`}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("TabsList must be used within a Tabs component");
  }

  return (
    <div
      className={`flex h-9 w-full items-center justify-center rounded-xl bg-[#f0ebe3] p-[3px] text-[#6d4c41] ${className}`}
    >
      {React.Children.map(children, (child) => {
        if (
          React.isValidElement(child) &&
          typeof (child as React.ReactElement<{ value?: string }>).props
            .value === "string"
        ) {
          const value = (child as React.ReactElement<{ value: string }>).props
            .value;
          return React.cloneElement(child, {
            isActive: value === context.activeTab,
            onClick: () => context.setActiveTab(value),
          } as Partial<React.ComponentProps<typeof TabsTrigger>>);
        }
        return child;
      })}
    </div>
  );
}

export function TabsTrigger({
  children,
  isActive = false,
  onClick,
  className = "",
}: {
  value: string;
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center rounded-xl border px-2 py-1 text-sm font-medium whitespace-nowrap transition-all ${
        isActive
          ? "border-transparent bg-[#8b4513] text-white"
          : "border-transparent text-[#6d4c41] hover:bg-[#f5e6d3]"
      } focus-visible:border-[#8b4513] focus-visible:ring-[3px] focus-visible:ring-[#8b4513]/50 focus-visible:outline-1 focus-visible:outline-[#8b4513] disabled:pointer-events-none disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  children,
  className = "",
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("TabsContent must be used within a Tabs component");
  }

  return (
    <div
      className={`flex-1 outline-none ${className}`}
      style={{ display: value === context.activeTab ? "block" : "none" }}
    >
      {children}
    </div>
  );
}
