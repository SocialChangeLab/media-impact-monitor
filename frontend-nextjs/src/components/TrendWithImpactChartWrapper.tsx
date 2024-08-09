"use client";
import { slugifyCssClass } from "@/utility/cssSlugify";
import useTopics from "@/utility/useTopics";
import useElementSize from "@custom-react-hooks/use-element-size";
import { AnimatePresence, motion } from "framer-motion";
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
			<div className="relative py-6">
				{showComputedImpact && (
					<span className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-grayLight to-bg" />
				)}
				<span className="pr-6 bg-bg relative z-10">
					<Button onClick={() => setShowComputedImpact((prev) => !prev)}>
						{showComputedImpact ? "Hide computed impact" : "Compute impact"}
					</Button>
				</span>
			</div>
			<Suspense>
				<AnimatePresence initial={false}>
					{showComputedImpact && (
						<motion.div
							className="w-full overflow-clip"
							initial={{ height: 0 }}
							animate={{ height: "auto" }}
							exit={{ height: 0 }}
							transition={{
								duration: 0.3,
								ease: "easeInOut",
							}}
						>
							<h3 className="text-xl font-semibold font-headlines mb-4">
								Computed impact
							</h3>
							<LazyLoadedImpactChart
								trend_type={trend_type}
								sentiment_target={sentiment_target}
							/>
						</motion.div>
					)}
				</AnimatePresence>
			</Suspense>
			<TopicsLegend
				topics={topics}
				id={`trend-with-impact-chart-${trend_type}-${sentiment_target || "none"}`}
			/>
		</div>
	);
}

export default TrendWithImpactChartWrapper;
