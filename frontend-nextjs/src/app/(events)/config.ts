import { subDays } from "date-fns";

export const defaultTo = new Date().toISOString();
export const defaultFrom = subDays(new Date(), 30).toISOString();
