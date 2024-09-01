'use client'
import type { TrendQueryProps } from '@/utility/mediaTrendUtil'
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
import {
	type ParsedFullTextsType,
	useFullTextsTrends,
} from '@/utility/useFullTextsTrends'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { BarChartIcon } from 'lucide-react'
import { ErrorBoundary } from 'next/dist/client/components/error-boundary'
import ChartLimitations from '../ChartLimitations'
import MediaSentimentChartEmpty from '../MediaSentimentChart/MediaSentimentChartEmpty'
import MediaSentimentChartError from '../MediaSentimentChart/MediaSentimentChartError'
import MediaSentimentChartLoading from '../MediaSentimentChart/MediaSentimentChartLoading'
import TopicChartTooltip from '../TopicChartTooltip'

export const FullTextSentimentChart = memo(
	({ data }: { data: ParsedFullTextsType['data'] }) => {
		const topics = useMemo(() => {
			return ['positive', 'neutral', 'negative'].map((topic) => ({
				topic,
				color: `var(--sentiment-${topic})`,
				sum:
					data?.trends?.reduce((acc, d) => {
						const val = d[topic as 'positive' | 'neutral' | 'negative'] ?? 0
						return acc + (val ?? 0)
					}, 0) ?? 0,
			}))
		}, [data?.trends])

		return (
			<div className="media-sentiment-chart">
				<div className="w-full h-[var(--media-sentiment-chart-height)]">
					<ResponsiveContainer>
						<BarChart
							data={data?.trends ?? []}
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
											aggregationUnit={'day'}
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

function FullTextsSentimentChartWithData({
	reset,
	sentiment_target,
	event_id,
}: {
	reset?: () => void
	sentiment_target: TrendQueryProps['sentiment_target']
	event_id: string
}) {
	const {
		data: originalData,
		isError,
		isPending,
		isSuccess,
	} = useFullTextsTrends({
		event_id,
		sentiment_target,
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
		return <FullTextSentimentChart data={data} />
	return <MediaSentimentChartEmpty />
}
export default function MediaCoverageChartWithErrorBoundary({
	sentiment_target,
	event_id,
}: {
	sentiment_target: TrendQueryProps['sentiment_target']
	event_id: string
}) {
	return (
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
						<FullTextsSentimentChartWithData
							reset={reset}
							sentiment_target={sentiment_target}
							event_id={event_id}
						/>
					</Suspense>
				</ErrorBoundary>
			)}
		</QueryErrorResetBoundary>
	)
}
