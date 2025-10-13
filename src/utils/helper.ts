import { unitOptions } from "../types/adminDashboard.interfaces";

export function getUnitLabel(value?: string) {
  if (!value) return "";
  return unitOptions.find((unit) => unit.value === value)?.label ?? "";
}

export function formatTo12Hour(timeString: string): string {
  const date = new Date(timeString);

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutesStr = minutes.toString().padStart(2, "0");

  return `${hours}:${minutesStr} ${ampm}`;
}
