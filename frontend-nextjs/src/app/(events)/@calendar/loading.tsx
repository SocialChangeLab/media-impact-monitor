import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import { defaultFrom, defaultTo } from "../config";

function CalendarPageLoading() {
	return (
		<Button variant="outline" className="text-grayDark">
			<CalendarDays className="mr-2 w-6 h-6" />
			<>
				{format(new Date(defaultFrom), "LLL dd, y")} -{" "}
				{format(new Date(defaultTo), "LLL dd, y")}
			</>
		</Button>
	);
}

export default CalendarPageLoading;
