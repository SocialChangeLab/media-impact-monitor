"use client";
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
		<div ref={parentRef}>
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
