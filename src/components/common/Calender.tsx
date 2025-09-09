import React from "react";
import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={`p-3 ${className || ""}`}
      classNames={{
        month: "flex flex-col gap-4 items-center",
        caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1",
        nav_button:
          "border border-input bg-background shadow-sm size-8 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-accent hover:text-accent-foreground",
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full flex border-collapse space-x-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex gap-1",
        cell: `h-9 w-9 text-center text-sm p-0 relative first:[&:has([data-selected])]:rounded-l-md bg-primary last:[&:has([data-selected])]:rounded-r-md focus-within:relative focus-within:z-20`,
        day: "hover:bg-accent hover:text-accent-foreground rounded-md w-fit size-8 p-0 font-normal data-selected:opacity-100 data-selected:bg-primary data-selected:text-white",
        day_button: "p-2",
        day_range_start:
          "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_range_end:
          "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ ...chevronProps }) => {
          if (chevronProps.orientation === "left") {
            return <ChevronLeft className="absolute top-8 left-15 size-4" />;
          }
          return <ChevronRight className="absolute top-8 right-15 size-4" />;
        },
      }}
      {...props}
    />
  );
}

export default Calendar;
