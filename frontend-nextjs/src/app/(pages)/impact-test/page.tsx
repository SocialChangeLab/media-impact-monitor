"use client";
import ImpactChart from "@/components/ImpactChart";
import SectionHeadlineWithExplanation from "@/components/SectionHeadlineWithExplanation";
import { slugifyCssClass } from "@/utility/cssSlugify";

export default function EventsPageWithSuspense() {
	const topics = [
		"Climate activism",
		"Climate crisis framing",
		"Climate policy",
		"Climate science",
	];
	return (
		<div className="topic-chart-wrapper">
			<style jsx global>{`
				.topic-chart-wrapper .recharts-cartesian-grid-vertical {
					transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1);
					opacity: 0 !important;
				}
				.topic-chart-wrapper svg:hover .recharts-cartesian-grid-vertical {
					opacity: 1 !important;
				}
				.topic-chart-wrapper:has(.legend-topic:hover) .topic-chart-item {
					opacity: 0.2 !important;
					filter: grayscale(100%) !important;
				}
				${topics
					.map((topic) => {
						const slug = slugifyCssClass(topic);
						return `
							html .topic-chart-wrapper:has(.legend-topic-${slug}:hover)
								.topic-chart-item-topic-${slug} {
									opacity: 1 !important;
									filter: grayscale(0%) !important;
								}
						`;
					})
					.join("")}
			`}</style>
			<SectionHeadlineWithExplanation headline="What topics are the focus of public discourse?">
				<ImpactChart trend_type="keywords" sentiment_target="activism" />
			</SectionHeadlineWithExplanation>
		</div>
	);
}
