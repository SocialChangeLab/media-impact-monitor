"use client";
import { slugifyCssClass } from "@/utility/cssSlugify";
import useTopics from "@/utility/useTopics";
import useElementSize from "@custom-react-hooks/use-element-size";
import dynamic from "next/dynamic";
import { type ReactNode, Suspense, useState } from "react";
import TopicsLegend from "./TopicsLegend";
import { Button } from "./ui/button";

const LazyLoadedImpactChart = dynamic(
	() => import("@/components/ImpactChart"),
	{ ssr: false },
);

function TrendWithImpactChartWrapper({
	children,
	trend_type,
	sentiment_target,
}: React.ComponentProps<typeof LazyLoadedImpactChart> & {
	children: ReactNode;
}) {
	const [showComputedImpact, setShowComputedImpact] = useState(false);
	const [parentRef, size] = useElementSize();
	const { topics } = useTopics({
		containerWidth: size.width,
		trend_type,
		sentiment_target,
	});

	return (
		<div ref={parentRef} className="topic-chart-wrapper">
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
					.map(({ topic }) => {
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
			{children}
			<Button
				onClick={() => setShowComputedImpact((prev) => !prev)}
				className="my-6"
			>
				{showComputedImpact ? "Hide computed impact" : "Compute impact"}
			</Button>
			<Suspense>
				{showComputedImpact && (
					<LazyLoadedImpactChart
						trend_type={trend_type}
						sentiment_target={sentiment_target}
					/>
				)}
			</Suspense>
			<TopicsLegend
				topics={topics}
				id={`trend-with-impact-chart-${trend_type}-${sentiment_target || "none"}`}
			/>
		</div>
	);
}

export default TrendWithImpactChartWrapper;
