import { endOfDay, parse, startOfDay, subDays } from "date-fns";
import { createContext, useContext } from "react";

const todayContext = createContext(new Date());
export const TodayProvider = todayContext.Provider;
export const useToday = () => {
	const today = useContext(todayContext);
	return {
		today,
		datasetStartDate: startOfDay(parse("01-01-2020", "dd-MM-yyyy", today)),
		datasetEndDate: endOfDay(subDays(today, 1)),
	};
};
