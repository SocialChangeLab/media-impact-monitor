import { cn } from '@/utility/classNames'
import type { ComparableDateItemType } from '@/utility/comparableDateItemSchema'
import { format } from '@/utility/dateUtil'
import { texts, titleCase } from '@/utility/textUtil'
import { getTopicIcon } from '@/utility/topicsUtil'
import { memo } from 'react'
import {
	type AggregationUnitType,
	formatDateByAggregationUnit,
} from './EventsTimeline/useAggregationUnit'
import { ImpactKeywordLabel } from './ImpactChart/ImpactKeywordLabel'

function TopicChartTooltip({
	aggregationUnit,
	topics,
	item,
}: {
	aggregationUnit: AggregationUnitType
	topics: {
		topic: string
		color: string
		sum: number
	}[]
	item: Record<string, number> & {
		comparableDateObject: ComparableDateItemType
	}
}) {
	const { date } = item.comparableDateObject
	return (
		<div
			className={cn(
				'bg-pattern-soft border border-grayMed p-4 flex flex-col gap-1',
				'shadow-lg shadow-black/5 dark:shadow-black/50',
			)}
		>
			<strong className="font-bold font-headlines text-base leading-tight pb-2 mb-2 border-b border-grayLight min-w-56">
				{aggregationUnit !== 'day' &&
					`${aggregationUnit.charAt(0).toUpperCase()}${aggregationUnit.slice(
						1,
					)} of `}
				{aggregationUnit === 'day' && format(date, 'EEEE d MMMM yyyy')}
				{aggregationUnit === 'month' && format(date, 'MMMM yyyy')}
				{aggregationUnit !== 'day' &&
					aggregationUnit !== 'month' &&
					formatDateByAggregationUnit(date, aggregationUnit)}
			</strong>
			{topics
				.map((t) => ({ ...t, value: item[t.topic] ?? 0 }))
				.map(({ topic, value, color }) => {
					const Icon = getTopicIcon(topic)
					return (
						<div
							key={topic}
							className="grid grid-cols-[auto_1fr_auto] gap-2 items-center text-sm"
						>
							<Icon className="size-6 shrink-0" color={color} />
							<ImpactKeywordLabel
								label={
									texts.charts.topics[
										topic as keyof typeof texts.charts.topics
									] ?? titleCase(topic)
								}
								slug={topic}
								color={color}
							/>
							<span className="font-mono text-xs text-grayDark">
								{(+value)?.toLocaleString(texts.language) ?? 0}
							</span>
						</div>
					)
				})}
			<div className="border-t border-grayLight pt-1 mt-1 flex gap-4 justify-between items-center">
				<strong className="font-bold ">{texts.charts.common.total}:</strong>
				<span className="font-mono text-xs text-grayDark">
					{topics
						.reduce((acc, { topic }) => acc + (item[topic] || 0), 0)
						.toLocaleString(texts.language)}
				</span>
			</div>
		</div>
	)
}

export default memo(TopicChartTooltip)
