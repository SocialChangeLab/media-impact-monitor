import SectionHeadlineWithExplanation from "@/components/SectionHeadlineWithExplanation";
import TimeFilter from "@/components/TimeFilter";
import type { ReactNode } from "react";

function EventsTimelineLayout({ children }: { children: ReactNode }) {
	return (
		<SectionHeadlineWithExplanation
			headline="Protest Timeline"
			description="See protests over time for each of the selected organisations"
			help="See protests over time for each of the selected organisations"
			additionalUi={<TimeFilter />}
		>
			{children}
		</SectionHeadlineWithExplanation>
	);
}

export default EventsTimelineLayout;
