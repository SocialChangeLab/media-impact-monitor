'use client'
import { slugifyCssClass } from '@/utility/cssSlugify'
import { texts } from '@/utility/textUtil'
import useTopics from '@/utility/useTopics'
import useElementSize from '@custom-react-hooks/use-element-size'
import { AnimatePresence, motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { type ReactNode, Suspense, useState } from 'react'
import { ChartDocsDialog } from './ChartDocsDialog'
import type { DataCreditLegendSource } from './DataCreditLegend'
import InViewContainer from './InViewContainer'
import TopicsLegend from './TopicsLegend'
import { Button } from './ui/button'

const LazyLoadedImpactChart = dynamic(
	() => import('@/components/ImpactChart'),
	{ ssr: false },
)

type TrendWithImpactChartWrapperProps = React.ComponentProps<
	typeof LazyLoadedImpactChart
> & {
	children: ReactNode
	impactHeadline?: string
	impactDescription?: string
	sources?: DataCreditLegendSource[]
	impactHelpSlug?: string
}

function ComputeImpactsButton({
	onClick = () => {},
	children,
}: {
	onClick?: () => void
	children: ReactNode
}) {
	return (
		<div className="relative py-6 flex justify-end">
			<span className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-bg to-grayLight" />
			<span className="pl-6 bg-bg relative z-20">
				<Button onClick={onClick}>{children}</Button>
			</span>
		</div>
	)
}

function TrendWithImpactChartWrapper({
	children,
	trend_type,
	sentiment_target,
	impactHeadline,
	impactDescription,
	sources,
	impactHelpSlug,
}: TrendWithImpactChartWrapperProps) {
	const [showComputedImpact, setShowComputedImpact] = useState(false)
	const [parentRef, size] = useElementSize()
	const { topics, applicability } = useTopics({
		containerWidth: size.width,
		trend_type,
		sentiment_target,
	})

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
						const slug = slugifyCssClass(topic)
						return `
							html .topic-chart-wrapper:has(.legend-topic-${slug}:hover)
								.topic-chart-item-topic-${slug} {
									opacity: 1 !important;
									filter: grayscale(0%) !important;
								}
						`
					})
					.join('')}
			`}</style>
			{children}
			{applicability && (
				<ComputeImpactsButton
					onClick={() => setShowComputedImpact((prev) => !prev)}
				>
					{showComputedImpact
						? texts.charts.impact.buttons.hideComputedImpacts
						: texts.charts.impact.buttons.computeImpacts}
				</ComputeImpactsButton>
			)}
			<Suspense>
				<AnimatePresence initial={false}>
					{showComputedImpact && applicability && (
						<motion.div
							className="w-full overflow-clip xl:-translate-y-10 relative z-10"
							initial={{ height: 0 }}
							animate={{ height: 'auto' }}
							exit={{ height: 0 }}
							transition={{
								duration: 0.3,
								ease: 'easeInOut',
							}}
						>
							<div className="pb-4 mb-2 flex flex-col gap-1 relative">
								<h3 className="text-xl font-semibold font-headlines">
									{impactHeadline}
								</h3>
								<p className="text-sm text-grayDark">{impactDescription}</p>
								<div className="xl:absolute bottom-2 right-0">
									<ChartDocsDialog helpSlug={impactHelpSlug} />
								</div>
							</div>
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
				sentiment_target={sentiment_target}
				trend_type={trend_type}
				sources={sources}
			/>
		</div>
	)
}

export default function TrendWithImpactChartWrapperInView(
	props: TrendWithImpactChartWrapperProps,
) {
	return (
		<InViewContainer
			fallback={
				<>
					{props.children}
					<ComputeImpactsButton>
						{texts.charts.impact.buttons.computeImpacts}
					</ComputeImpactsButton>
					<TopicsLegend
						sentiment_target={props.sentiment_target}
						trend_type={props.trend_type}
						sources={props.sources}
					/>
				</>
			}
		>
			<TrendWithImpactChartWrapper {...props} />
		</InViewContainer>
	)
}
