import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { format } from '@/utility/dateUtil'
import type { OrganisationType, ParsedEventType } from '@/utility/eventsUtil'
import { texts } from '@/utility/textUtil'
import { type ReactNode, memo, useMemo } from 'react'
import {
	type AggregationUnitType,
	formatDateByAggregationUnit,
} from './useAggregationUnit'
import OrgLine from './EventTooltipOrgLine'

function AggregatedEventsTooltip({
	date,
	sumSize,
	aggregationUnit,
	events,
	organisations,
	children,
}: {
	date: Date
	sumSize: number | undefined
	aggregationUnit: AggregationUnitType
	events: ParsedEventType[]
	organisations: OrganisationType[]
	children: ReactNode
}) {
	const formattedDate = useMemo(
		() => formatDateByAggregationUnit(date, aggregationUnit),
		[date, aggregationUnit],
	)

	const orgs = useMemo(
		() =>
			organisations
				.map((org) => ({
					...org,
					count: events.filter((event) =>
						event.organizers.find((x) => x.slug === org.slug),
					).length,
				}))
				.sort((a, b) => b.count - a.count),
		[organisations, events],
	)

	return (
		<Tooltip>
			<TooltipTrigger>{children}</TooltipTrigger>
			<TooltipContent className="px-0">
				<p className="text-base pt-2 pb-3 max-w-80 px-4">
					{texts.charts.protest_timeline.tooltips.aggregated({
						timeUnitLabel:
							texts.charts.aggregationUnit[
								aggregationUnit as keyof typeof texts.charts.aggregationUnit
							],
						timeValue:
							aggregationUnit === 'month'
								? format(date, 'LLLL yyyy')
								: formattedDate,
						protestCount: events.length,
						participantCount: sumSize,
						orgsCount: orgs.length,
					})}
				</p>
				{orgs.map((org) => (
					<OrgLine key={org.slug} {...org} />
				))}
			</TooltipContent>
		</Tooltip>
	)
}

export default memo(AggregatedEventsTooltip)
