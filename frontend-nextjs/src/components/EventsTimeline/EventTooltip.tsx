import { Tooltip, TooltipContent } from '@/components/ui/tooltip'
import { cn } from '@/utility/classNames'
import { format } from '@/utility/dateUtil'
import type { OrganisationType, ParsedEventType } from '@/utility/eventsUtil'
import { texts } from '@/utility/textUtil'
import { Users } from 'lucide-react'
import { type PropsWithChildren, useMemo, useState } from 'react'
import { Button } from '../ui/button'
import OrgLine from './EventTooltipOrgLine'

function EventTooltip({
	event,
	organisations,
	children,
}: PropsWithChildren<{
	event: ParsedEventType
	organisations: OrganisationType[]
}>) {
	const [descriptionExpanded, setDescriptionExpanded] = useState(false)
	const orgs = useMemo(() => {
		const unknownOrgName = texts.filters.organisations.unknownOrganisation
		const mappedOrgs = event.organizers
			.map((orgName) => {
				const org = organisations.find((x) => x.slug === orgName.slug)
				if (!org) return
				return {
					...org,
					name: org.name.trim() || unknownOrgName,
				}
			})
			.filter(Boolean) as (OrganisationType & { isSelected: boolean })[]
		return mappedOrgs
	}, [event.organizers, organisations])

	const formattedDate = useMemo(
		() => format(new Date(event.date), 'EEEE d MMMM yyyy'),
		[event.date],
	)

	const formattedImpact = useMemo(
		() =>
			event.size_number
				? Math.round(event.size_number).toLocaleString(texts.language)
				: '?',
		[event.size_number],
	)

	return (
		<Tooltip delayDuration={50}>
			{children}
			<TooltipContent className="p-0 pb-4">
				<ul
					className={cn(
						'flex justify-between items-center border-b py-2',
						'mb-2 border-grayLight px-4',
					)}
				>
					<li className="flex gap-4 items-center font-bold font-headlines text-base">
						{formattedDate}
					</li>
					<li className={cn('flex gap-2 items-center')}>
						<Users size={16} className={cn('text-grayDark')} />
						<span>{formattedImpact}</span>
					</li>
				</ul>
				<p
					className={cn(
						'max-w-80 text-xs mb-1 px-4',
						!descriptionExpanded && 'line-clamp-3',
					)}
				>
					{event.description}
				</p>
				<Button
					variant="ghost"
					onClick={() => setDescriptionExpanded(!descriptionExpanded)}
					className="text-xs font-medium px-1 py-0.5 -translate-x-1 -mt-0.5 h-auto mb-3 hover:translate-x-0 transition ml-4"
				>
					{descriptionExpanded
						? texts.uiCommon.showLess
						: texts.uiCommon.showMore}
				</Button>
				{orgs.map((org) => (
					<OrgLine key={org.slug} {...org} />
				))}
			</TooltipContent>
		</Tooltip>
	)
}

export default EventTooltip
