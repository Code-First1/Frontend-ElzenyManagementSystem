import { unitOptions } from "../types/adminDashboard.interfaces";

export function getUnitLabel(value?: string) {
  if (!value) return "";
  return unitOptions.find((unit) => unit.value === value)?.label ?? "";
}
