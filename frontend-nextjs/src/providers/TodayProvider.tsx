import { endOfDay, parse, startOfDay, subDays } from "date-fns";
import { createContext, useContext } from "react";

export function getDatasetRange(today: Date) {
	return {
		datasetStartDate: startOfDay(parse("01-01-2020", "dd-MM-yyyy", today)),
		datasetEndDate: endOfDay(subDays(today, 1)),
	}
}

const todayContext = createContext(new Date());
export const TodayProvider = todayContext.Provider;
export const useToday = () => {
	const today = useContext(todayContext);
	return {
		today,
		...getDatasetRange(today),
	};
};
