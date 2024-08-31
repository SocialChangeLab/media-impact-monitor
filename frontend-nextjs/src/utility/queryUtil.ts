import { endOfDay, getTime } from "date-fns";

export function getStaleTime(today: Date) {
  return getTime(endOfDay(today)) - getTime(today);
}
