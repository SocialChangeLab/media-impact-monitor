"use client";

import { subDays, subMonths } from "date-fns";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { Calendar } from "./calendar";

export default function CalendarFixture() {
	const [selected, setSelected] = useState<DateRange | undefined>({
		from: subDays(new Date(), 25),
		to: new Date(),
	});
	return (
		<div className="w-screen h-screen relative flex justify-center items-center p-8">
			<div className="border border-dashed border-grayLight p-8 rounded-lg bg-pattern-soft">
				<Calendar
					initialFocus
					mode="range"
					selected={selected}
					onSelect={setSelected}
					numberOfMonths={2}
					defaultMonth={subMonths(new Date(), 1)}
					disabled={{ after: new Date() }}
				/>
			</div>
		</div>
	);
}
