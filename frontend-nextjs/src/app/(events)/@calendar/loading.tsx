"use client";
import { Button } from "@/components/ui/button";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";

function CalendarPageLoading() {
	const { from, to } = useFiltersStore();
	return (
		<Button variant="outline" className="text-grayDark">
			<CalendarDays className="mr-2 w-6 h-6" />
			{format(from, "LLL dd, y")} - {format(to, "LLL dd, y")}
		</Button>
	);
}

export default CalendarPageLoading;
