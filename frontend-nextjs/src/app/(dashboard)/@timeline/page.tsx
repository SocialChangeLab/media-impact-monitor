import EventsTimeline from "@/components/EventsTimeline/EventsTimeline";
import SectionHeadlineWithExplanation from "@/components/SectionHeadlineWithExplanation";
import TimeFilter from "@/components/TimeFilter";

async function TimelineRoute() {
	return (
		<SectionHeadlineWithExplanation
			headline="Protest Timeline"
			description="See protests over time for each of the selected organisations"
			help="See protests over time for each of the selected organisations"
			additionalUi={<TimeFilter />}
		>
			<EventsTimeline />
		</SectionHeadlineWithExplanation>
	);
}

export default TimelineRoute;
