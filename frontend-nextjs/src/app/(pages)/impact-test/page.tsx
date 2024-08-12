import ImpactChart from "@/components/ImpactChart";
import SectionHeadlineWithExplanation from "@/components/SectionHeadlineWithExplanation";

export default function EventsPageWithSuspense() {
	return (
		<>
			<SectionHeadlineWithExplanation headline="What topics are the focus of public discourse?">
				<ImpactChart trend_type="keywords" sentiment_target="activism" />
			</SectionHeadlineWithExplanation>
		</>
	);
}
