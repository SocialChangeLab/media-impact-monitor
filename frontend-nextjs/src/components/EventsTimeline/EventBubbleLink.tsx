import { cn } from '@/utility/classNames'
import { EventType, OrganisationType } from '@/utility/eventsUtil'
import { Link } from 'next-view-transitions'

type EventBubbleLinkProps = {
	event: EventType
	organisations: OrganisationType[]
}

function EventBubbleLink({ event, organisations }: EventBubbleLinkProps) {
	const mappedOrganisations = event.organizers
		.map((x) => organisations.find((y) => y.name === x))
		.filter(Boolean) as OrganisationType[]
	return (
		<Link
			href={`/events/${event.event_id}`}
			className={cn(
				'absolute inset-0 rounded-full bg-grayMed',
				'ring-0 ring-fg transition-all hover:ring-2',
				'ring-offset-0 ring-offset-bg hover:ring-offset-2',
				'focus-visible:ring-offset-2 focus-visible:ring-2',
				'cursor-pointer active:cursor-pointer',
			)}
			style={{
				background: getCSSStyleGradient(
					mappedOrganisations.map((x) => x.color),
				),
			}}
		/>
	)
}

function getCSSStyleGradient(colors: string[]) {
	if (colors.length === 0) return
	if (colors.length === 1) return colors[0]
	const stepPercentage = Math.round(100 / colors.length)
	return `linear-gradient(0deg, ${colors
		.map(
			(color, i) =>
				`${color} ${i * stepPercentage}%, ${color} ${(i + 1) * stepPercentage}%`,
		)
		.join(', ')})`
}

export default EventBubbleLink
