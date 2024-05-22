import SectionHeadlineWithExplanation from "@/components/SectionHeadlineWithExplanation";
import type { ReactNode } from "react";

function EventsTimelineLayout({
	children,
	calendar,
}: { children: ReactNode; calendar: ReactNode }) {
	return (
		<SectionHeadlineWithExplanation
			headline="Protest Timeline"
			description="See protests over time for each of the selected organisations"
			help="See protests over time for each of the selected organisations"
			additionalUi={calendar}
		>
			{children}
		</SectionHeadlineWithExplanation>
	);
}

export default EventsTimelineLayout;
