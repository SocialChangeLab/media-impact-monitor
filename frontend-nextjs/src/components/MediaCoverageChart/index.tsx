'use client'
import useElementSize from '@custom-react-hooks/use-element-size'
import { Suspense, memo, useMemo } from 'react'
import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'

import TopicChartTooltip from '@/components/TopicChartTooltip'
import { slugifyCssClass } from '@/utility/cssSlugify'
import { parseErrorMessage } from '@/utility/errorHandlingUtil'
import { texts } from '@/utility/textUtil'
import useMediaTrends from '@/utility/useMediaTrends'
import useTopics from '@/utility/useTopics'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { LineChartIcon } from 'lucide-react'
import { ErrorBoundary } from 'next/dist/client/components/error-boundary'
import ChartLimitations from '../ChartLimitations'
import InViewContainer from '../InViewContainer'
import MediaCoverageChartEmpty from './MediaCoverageChartEmpty'
import MediaCoverageChartError from './MediaCoverageChartError'
import MediaCoverageChartLoading from './MediaCoverageChartLoading'

const MediaCoverageChart = memo(() => {
	const [parentRef, size] = useElementSize()
	const { topics, filteredData, aggregationUnit } = useTopics({
		containerWidth: size.width,
		trend_type: 'keywords',
		sentiment_target: null,
	})

	return (
		<div className="max-w-content">
			<div
				className="w-full h-[var(--media-coverage-chart-height)] bg-grayUltraLight"
				ref={parentRef}
			>
				<ResponsiveContainer>
					<LineChart
						width={size.width}
						height={size.height}
						data={filteredData}
						className="bg-pattern-soft"
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
							tickFormatter={(value) =>
								`${value.toLocaleString(texts.language)}`
							}
						/>
						<Tooltip
							formatter={(value) => `${value} articles`}
							cursor={{ stroke: 'var(--grayMed)' }}
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
								topics.map(({ topic, color }, idx) => (
									<Line
										key={topic}
										type="monotone"
										dataKey={topic}
										stroke={color}
										fill={color}
										className={`topic-chart-item topic-chart-item-topic-${slugifyCssClass(
											topic,
										)} transition-all`}
										activeDot={{ r: 6, stroke: 'var(--grayUltraLight)' }}
										isAnimationActive={false}
									/>
								)),
							[topics],
						)}
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	)
})

function MediaCoverageChartWithData({ reset }: { reset?: () => void }) {
	const { data, isError, isSuccess, isPending } = useMediaTrends({
		trend_type: 'keywords',
	})
	if (isPending) return <MediaCoverageChartLoading />
	if (isError)
		return (
			<MediaCoverageChartError {...parseErrorMessage(isError)} reset={reset} />
		)
	if (isSuccess && data.limitations.length > 0)
		return (
			<ChartLimitations limitations={data.limitations} Icon={LineChartIcon} />
		)
	if (isSuccess && data.applicability) return <MediaCoverageChart />
	return <MediaCoverageChartEmpty />
}
export default function MediaCoverageChartWithErrorBoundary() {
	return (
		<InViewContainer fallback={<MediaCoverageChartLoading />}>
			<QueryErrorResetBoundary>
				{({ reset }) => (
					<ErrorBoundary
						errorComponent={({ error }) => (
							<MediaCoverageChartError
								{...parseErrorMessage(error)}
								reset={reset}
							/>
						)}
					>
						<Suspense fallback={<MediaCoverageChartLoading />}>
							<MediaCoverageChartWithData reset={reset} />
						</Suspense>
					</ErrorBoundary>
				)}
			</QueryErrorResetBoundary>
		</InViewContainer>
	)
}
