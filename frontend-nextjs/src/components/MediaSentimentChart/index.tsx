'use client'
import type { TrendQueryProps } from '@/utility/mediaTrendUtil'
import useElementSize from '@custom-react-hooks/use-element-size'
import { Suspense, memo, useMemo } from 'react'
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'

import { slugifyCssClass } from '@/utility/cssSlugify'
import { parseErrorMessage } from '@/utility/errorHandlingUtil'
import useMediaTrends from '@/utility/useMediaTrends'
import useTopics from '@/utility/useTopics'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { BarChartIcon } from 'lucide-react'
import { ErrorBoundary } from 'next/dist/client/components/error-boundary'
import ChartLimitations from '../ChartLimitations'
import InViewContainer from '../InViewContainer'
import TopicChartTooltip from '../TopicChartTooltip'
import MediaSentimentChartEmpty from './MediaSentimentChartEmpty'
import MediaSentimentChartError from './MediaSentimentChartError'
import MediaSentimentChartLoading from './MediaSentimentChartLoading'

export const MediaSentimentChart = memo(
	({
		sentiment_target,
	}: {
		sentiment_target: TrendQueryProps['sentiment_target']
	}) => {
		const [parentRef, size] = useElementSize()
		const {
			topics: queryTopics,
			filteredData,
			aggregationUnit,
		} = useTopics({
			containerWidth: size.width,
			trend_type: 'sentiment',
			sentiment_target,
		})

		const topics = useMemo(() => {
			return ['positive', 'neutral', 'negative'].map((topic) => ({
				topic,
				color: `var(--sentiment-${topic})`,
				sum: queryTopics.find((t) => t.topic === topic)?.sum ?? 0,
			}))
		}, [queryTopics])

		return (
			<div className="media-sentiment-chart">
				<div
					className="w-full h-[var(--media-sentiment-chart-height)] bg-grayUltraLight"
					ref={parentRef}
				>
					<ResponsiveContainer>
						<BarChart
							data={filteredData}
							className="bg-pattern-soft"
							barGap={0}
							barCategoryGap={2}
							margin={{
								top: 0,
								right: 0,
								left: 0,
								bottom: 24,
							}}
						>
							<CartesianGrid
								stroke="var(--grayLight)"
								fill="var(--grayUltraLight)"
								horizontal={false}
							/>
							<XAxis
								dataKey="dateFormatted"
								stroke="var(--grayDark)"
								strokeWidth={0.25}
								fontSize="0.875rem"
								interval="equidistantPreserveStart"
								tickMargin={12}
								tickSize={8}
								tickLine={{
									strokeOpacity: 1,
									stroke: 'var(--grayDark)',
								}}
							/>
							<YAxis
								stroke="var(--grayDark)"
								strokeWidth={0.25}
								fontSize="0.875rem"
								padding={{ top: 24 }}
							/>
							<Tooltip
								formatter={(value) => `${value} articles`}
								cursor={{ fill: 'var(--bgOverlay)', fillOpacity: 0.5 }}
								content={({ payload, active }) => {
									const item = payload?.at(0)?.payload
									if (!active || !payload || !item) return null
									return (
										<TopicChartTooltip
											topics={topics}
											aggregationUnit={aggregationUnit}
											item={item}
										/>
									)
								}}
							/>
							{useMemo(
								() =>
									topics.map(({ topic, color }) => (
										<Bar
											key={topic}
											type="monotone"
											stackId="1"
											dataKey={topic}
											stroke={color}
											fill={color}
											className={`topic-chart-item topic-chart-item-topic-${slugifyCssClass(
												topic,
											)} transition-all`}
											isAnimationActive={false}
										/>
									)),
								[topics],
							)}
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>
		)
	},
)

function MediaSentimentChartWithData({
	reset,
	sentiment_target,
	event_id,
}: {
	reset?: () => void
	sentiment_target: TrendQueryProps['sentiment_target']
	event_id?: string
}) {
	const {
		data: originalData,
		isError,
		isPending,
		isSuccess,
	} = useMediaTrends({
		trend_type: 'sentiment',
		sentiment_target,
		enabled: !event_id,
	})
	const data = originalData || {
		applicability: false,
		limitations: [],
		trends: [],
	}
	if (isPending) return <MediaSentimentChartLoading />
	if (isError)
		return (
			<MediaSentimentChartError {...parseErrorMessage(isError)} reset={reset} />
		)
	if (isSuccess && data.applicability === false && data.limitations.length > 0)
		return (
			<ChartLimitations limitations={data.limitations} Icon={BarChartIcon} />
		)
	if (isSuccess && data.applicability && (data.trends?.length ?? 0) > 0)
		return <MediaSentimentChart sentiment_target={sentiment_target} />
	return <MediaSentimentChartEmpty />
}
export default function MediaCoverageChartWithErrorBoundary({
	sentiment_target,
	event_id,
}: {
	sentiment_target: TrendQueryProps['sentiment_target']
	event_id?: string
}) {
	return (
		<InViewContainer fallback={<MediaSentimentChartLoading />}>
			<QueryErrorResetBoundary>
				{({ reset }) => (
					<ErrorBoundary
						errorComponent={({ error }) => (
							<MediaSentimentChartError
								{...parseErrorMessage(error)}
								reset={reset}
							/>
						)}
					>
						<Suspense fallback={<MediaSentimentChartLoading />}>
							<MediaSentimentChartWithData
								reset={reset}
								sentiment_target={sentiment_target}
								event_id={event_id}
							/>
						</Suspense>
					</ErrorBoundary>
				)}
			</QueryErrorResetBoundary>
		</InViewContainer>
	)
}
