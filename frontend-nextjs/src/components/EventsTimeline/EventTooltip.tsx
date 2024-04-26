import { Tooltip, TooltipContent, TooltipTrigger } from '@components/ui/tooltip'
import { cn } from '@utility/classNames'
import { EventType, OrganisationType } from '@utility/eventsUtil'
import { format } from 'date-fns'
import { Target } from 'lucide-react'
import { PropsWithChildren, useMemo } from 'react'

function EventTooltip({
	event,
	organisations,
	children,
}: PropsWithChildren<{ event: EventType; organisations: OrganisationType[] }>) {
	const org = useMemo(() => {
		const eventOrgName = event.organizations[0]
		const unknownOrgName = 'Unknown organisation'
		const eventOrg = organisations.find((x) => x.name === eventOrgName)
		const unknownOrg = organisations.find((x) => x.name === unknownOrgName)
		return eventOrg ?? unknownOrg
	}, [event.organizations, organisations])

	const formattedDate = useMemo(
		() => format(new Date(event.date), 'd MMMM yyyy'),
		[event.date],
	)

	const formattedImpact = useMemo(
		() => Math.round(event.impact).toLocaleString('en-GB'),
		[event.impact],
	)

	return (
		<Tooltip>
			<TooltipTrigger asChild>{children}</TooltipTrigger>
			<TooltipContent>
				<ul
					className={cn(
						'flex justify-between items-center border-b py-2',
						'mb-2 border-white/10 dark:border-black/10',
					)}
				>
					<li className="flex gap-4 items-center">{formattedDate}</li>
					<li className="flex gap-2 items-center">
						<Target size={16} className="text-white/60 dark:text-black/60" />
						<span>{formattedImpact}</span>
					</li>
				</ul>
				<p className="max-w-80 line-clamp-3 text-xs">{event.description}</p>
				{org && (
					<div
						className={cn(
							'grid grid-cols-[auto_1fr] gap-x-2 items-center',
							'border-t border-white/10 dark:border-black/10 py-2 mt-3',
						)}
					>
						<span
							className={cn(
								'size-4 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)] bg-grayDark',
							)}
							style={{ backgroundColor: org.color }}
							aria-hidden="true"
						/>
						<span className="truncate">{org.name}</span>
					</div>
				)}
			</TooltipContent>
		</Tooltip>
	)
}

export default EventTooltip
