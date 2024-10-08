'use client'
import { useFiltersStore } from '@/providers/FiltersStoreProvider'
import { cn } from '@/utility/classNames'
import { slugifyCssClass } from '@/utility/cssSlugify'
import { format } from '@/utility/dateUtil'
import { parseErrorMessage } from '@/utility/errorHandlingUtil'
import type {
	EventOrganizerSlugType,
	OrganisationType,
} from '@/utility/eventsUtil'
import type { ParsedMediaImpactItemType } from '@/utility/mediaImpactUtil'
import { texts, titleCase } from '@/utility/textUtil'
import { topicIsSentiment } from '@/utility/topicsUtil'
import { useAllEvents, useFilteredEvents } from '@/utility/useEvents'
import { useOrganisation } from '@/utility/useOrganisations'
import { scaleQuantize } from 'd3-scale'
import {
	AlertCircle,
	ArrowDown,
	ArrowUp,
	Asterisk,
	Minus,
	X,
	type icons,
} from 'lucide-react'
import { memo, useEffect, useMemo, useState } from 'react'
import slugify from 'slugify'
import { OrganisationsSelect } from '../OrganisationsSelect'
import { Portal, Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import {
	ImpactKeywordLabel,
	ImpactKeywordLabelTooltip,
	ImpactSentimentLabelTooltip,
	topicsMap,
} from './ImpactKeywordLabel'

const SelectedTimeframeTooltip = memo(
	({ organisation }: { organisation?: OrganisationType }) => {
		const from = useFiltersStore(({ from }) => format(from, 'LLLL d, yyyy'))
		const to = useFiltersStore(({ to }) => format(to, 'LLLL d, yyyy'))
		const { allEvents } = useAllEvents()
		const { filteredEvents } = useFilteredEvents()
		const minPercentageConsideredGood = 40

		const { color, percentageOfOrgsInTimeframe, showNotice } = useMemo(() => {
			if (!allEvents || !organisation)
				return {
					color: undefined,
					percentageOfOrgsInTimeframe: undefined,
					showNotice: false,
				}
			const allEventsFromOrg = allEvents.filter((e) =>
				e.organizers.find((o) => o.slug === organisation.slug),
			).length
			const eventsFromOrgInTimeframe = filteredEvents.filter((e) =>
				e.organizers.find((o) => o.slug === organisation.slug),
			).length
			const percentageOfOrgsInTimeframe =
				(eventsFromOrgInTimeframe / allEventsFromOrg) * 100
			const scale = scaleQuantize<number, string>()
				.domain([0, minPercentageConsideredGood])
				.range([
					'var(--sentiment-negative)',
					'var(--sentiment-neutral)',
				] as unknown as number[])
			const color = scale(percentageOfOrgsInTimeframe)
			return {
				color: typeof color === 'string' ? color : undefined,
				percentageOfOrgsInTimeframe,
				showNotice: percentageOfOrgsInTimeframe < minPercentageConsideredGood,
			}
		}, [allEvents, filteredEvents, organisation])

		return (
			<Tooltip delayDuration={0}>
				<TooltipTrigger>
					<span
						className="underline decoration-grayMed underline-offset-2 flex items-center gap-0.5"
						style={{
							textDecorationColor: showNotice ? (color as string) : undefined,
						}}
					>
						{texts.charts.impact.introduction.selectedTimeFrame.label}
						{showNotice && (
							<AlertCircle
								className="w-4 h-4"
								style={{ color: color as string }}
							/>
						)}
					</span>
				</TooltipTrigger>
				<Portal>
					<TooltipContent className="w-fit">
						<p className="py-1 px-1 max-w-80">
							{texts.charts.impact.introduction.selectedTimeFrame.tooltipMessage(
								{
									fromNode: <strong className="font-bold">{from}</strong>,
									toNode: <strong className="font-bold">{to}</strong>,
								},
							)}
						</p>
						{showNotice && (
							<p className="py-1 px-1 max-w-80">
								{texts.charts.impact.introduction.selectedTimeFrame.tooltipNotice(
									{
										percentageNode: (
											<span
												className="font-bold"
												style={{ color: color as string }}
											>
												{Math.round(percentageOfOrgsInTimeframe ?? 0)}%
											</span>
										),
										organisationNode: (
											<strong className="font-bold">
												{organisation?.name}
											</strong>
										),
									},
								)}
							</p>
						)}
					</TooltipContent>
				</Portal>
			</Tooltip>
		)
	},
)

type ImpactChartColumnDescriptionsProps = {
	impacts: ParsedMediaImpactItemType[] | null
	icon?: keyof typeof icons
	unitLabel: string
	limitations?: string[]
	error?: Error | null
	defaultOrganizer?: EventOrganizerSlugType
	onOrgChange?: (organiser: EventOrganizerSlugType) => void
	isPending?: boolean
	itemsCountPerColumn?: number
	colIdx: number
}

function ImpactChartColumnDescriptions({
	impacts,
	unitLabel,
	limitations = [],
	error,
	defaultOrganizer,
	onOrgChange = () => {},
	isPending = false,
	itemsCountPerColumn = 1,
	colIdx,
}: ImpactChartColumnDescriptionsProps) {
	const sortedImpacts = (impacts ?? []).sort((a, b) =>
		a.label.localeCompare(b.label),
	)

	const [organizer, setOrganizer] = useState<
		EventOrganizerSlugType | undefined
	>(defaultOrganizer)
	const selectedOrganizers = useFiltersStore((state) => state.organizers.sort())
	const { organisation } = useOrganisation(organizer)

	useEffect(() => {
		if (!defaultOrganizer) return
		setOrganizer(defaultOrganizer)
	}, [defaultOrganizer])

	const hasLimitations = useMemo(
		() => !isPending && limitations.length > 0,
		[limitations, isPending],
	)

	return (
		<div
			className={cn(
				'flex flex-col gap-6 md:pr-6',
				colIdx === 1 && 'max-md:hidden',
				colIdx === 2 && 'max-lg:hidden',
			)}
		>
			<div className="flex flex-col gap-2">
				<OrganisationsSelect
					multiple={false}
					organisations={
						selectedOrganizers.length === 0 ? undefined : selectedOrganizers
					}
					selectedOrganisations={organizer ? [organizer] : []}
					onChange={(orgs) => {
						setOrganizer(orgs[0])
						onOrgChange(orgs[0])
					}}
				/>
				{hasLimitations && !!organisation && !error && (
					<>
						<p className="mt-2 text-grayDark relative pl-9">
							<Asterisk className="absolute left-0 -top-1 text-grayDark opacity-50 size-6 translate-y-0.5" />
							{texts.charts.impact.limitation.message({
								organisationNode: (
									<strong className="text-fg font-semibold">
										{organisation.name}
									</strong>
								),
							})}
						</p>
						<ul className="flex flex-col gap-2 list-disc marker:text-grayMed pl-9">
							{limitations.map((l) => (
								<li key={l} className="ml-4 pl-1 font-semibold">
									{texts.charts.impact.limitation.limitationTranslations[
										l.trim() as keyof typeof texts.charts.impact.limitation.limitationTranslations
									] ?? l}
								</li>
							))}
						</ul>
						<p className="text-grayDark pl-9">
							{texts.charts.impact.limitation.widenYourFilters}
						</p>
					</>
				)}
				{error && (
					<>
						<p className="mt-2 text-grayDark relative pl-9">
							<X className="absolute left-0 -top-1 text-red-600 size-6 translate-y-0.5" />
							{texts.charts.impact.error.message}
						</p>
						<p className="ml-4 font-semibold pl-5">
							{`"${parseErrorMessage(error).message}"`}
							{parseErrorMessage(error).details && (
								<pre
									className={cn(
										'min-w-full px-3 py-2 bg-grayDark mt-2 text-sm',
										'dark:bg-bg dark:text-fg dark:border dark:border-grayLight',
										'text-mono text-bg max-w-full overflow-x-auto',
									)}
								>
									<code>{parseErrorMessage(error).details}</code>
								</pre>
							)}
						</p>
						<p className="text-grayDark pl-9">
							{texts.charts.impact.error.changeYourFilters}
						</p>
					</>
				)}
				{((!error && !hasLimitations) || isPending) && (
					<p className="mt-4">
						{texts.charts.impact.introduction.message({
							organisationNode: !organisation ? (
								<span className="h-4 w-32 inline-block rounded bg-grayLight animate-pulse translate-y-[0.15rem]" />
							) : (
								<strong>{organisation.name}</strong>
							),
							selectedTimeFrameNode: (
								<SelectedTimeframeTooltip organisation={organisation} />
							),
						})}
						:
					</p>
				)}
				{!isPending &&
					!error &&
					sortedImpacts.map((i) => (
						<ImpactChartColumnDescriptionsSentence
							key={i.label}
							unitLabel={unitLabel}
							{...i}
						/>
					))}
				{isPending &&
					Array.from({ length: itemsCountPerColumn }).map((_, idx) => (
						<div
							key={`pending-${
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								idx
							}`}
							className="flex flex-col gap-1.5 mb-3 pl-5 relative animate-pulse first-of-type:mt-1.5"
						>
							<Minus
								className={cn(
									'absolute left-0 top-0.5 text-grayDark size-4 translate-y-0.5',
									'opacity-50',
								)}
							/>
							<span className="h-4 w-full inline-block rounded bg-grayLight animate-pulse translate-y-1" />
							<span className="h-4 w-2/3 inline-block rounded bg-grayLight animate-pulse translate-y-1 delay-200" />
						</div>
					))}
			</div>
		</div>
	)
}

function formatValue(value: number) {
	return [
		value === 0 ? '' : value > 0 ? '+' : '−',
		Number.parseFloat(Math.abs(value).toFixed(2)).toLocaleString(
			texts.language,
		),
	].join('')
}

function ImpactChartColumnDescriptionsSentence(
	i: ParsedMediaImpactItemType & {
		unitLabel: string
	},
) {
	const incdeclabel = i.impact.lower > 0 ? 'increase' : 'decrease'
	const formattedLowerBound = formatValue(i.impact.lower)
	const formattedUpperBound = formatValue(i.impact.upper)
	const unclearTendency =
		(i.impact.upper > 0 && i.impact.lower < 0) ||
		(formattedLowerBound === '0' && formattedUpperBound === '0')
	const noChange =
		formattedLowerBound === formattedUpperBound && formattedLowerBound === '0'
	const isSentiment = topicIsSentiment(i.label)
	const leastBound =
		incdeclabel === 'increase' ? formattedLowerBound : formattedUpperBound
	const mostBound =
		incdeclabel === 'increase' ? formattedUpperBound : formattedLowerBound
	const ChangeIcon = useMemo(() => {
		if (unclearTendency) return Minus
		return i.impact.mean > 0 ? ArrowUp : ArrowDown
	}, [unclearTendency, i.impact.mean])

	const topicNodeWithoutTooltip = useMemo(
		() => (
			<ImpactKeywordLabel
				{...i}
				slug={i.label}
				label={
					texts.charts.topics[i.label as keyof typeof texts.charts.topics] ??
					titleCase(i.label)
				}
			/>
		),
		[i],
	)

	const topicNode = useMemo(() => {
		return isSentiment ? (
			<ImpactSentimentLabelTooltip>
				{topicNodeWithoutTooltip}
			</ImpactSentimentLabelTooltip>
		) : (
			<ImpactKeywordLabelTooltip
				unitLabel={i.unitLabel}
				keywords={topicsMap.get(
					slugify(i.label, { lower: true, strict: true }),
				)}
			>
				{topicNodeWithoutTooltip}
			</ImpactKeywordLabelTooltip>
		)
	}, [i.unitLabel, i.label, topicNodeWithoutTooltip, isSentiment])

	const {
		unclearChange,
		clearChange,
		noChange: noChangeFn,
	} = texts.charts.impact.descriptions
	const textFnProps = {
		isSentiment,
		topicNode,
		isIncreasing: i.impact.lower > 0,
		leastBound,
		mostBound,
	}
	return (
		<p
			className={cn(
				'mt-2 pl-5 relative text-grayDark text-balance',
				`legend-topic legend-topic-${slugifyCssClass(i.label)}`,
			)}
		>
			<ChangeIcon
				className={cn(
					'absolute left-0 top-0 text-grayDark size-4 translate-y-0.5',
					unclearTendency && 'opacity-50',
				)}
			/>
			{unclearTendency && !noChange && unclearChange(textFnProps)}
			{!unclearTendency && !noChange && clearChange(textFnProps)}
			{noChange && noChangeFn(textFnProps)}
		</p>
	)
}

export default ImpactChartColumnDescriptions
