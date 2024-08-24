import { toZonedTime } from "date-fns-tz";

export const today = toZonedTime(new Date(), "America/New_York");
