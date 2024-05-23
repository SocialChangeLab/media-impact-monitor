import { cn } from "@/utility/classNames";
import type { EventType, OrganisationType } from "@/utility/eventsUtil";
import Link from "next/link";
import { memo } from "react";
import { TooltipTrigger } from "../ui/tooltip";

type EventBubbleLinkProps = {
	event: EventType;
	organisations: OrganisationType[];
};

const bubbleClasses = cn(
	"absolute inset-0 rounded-full bg-grayMed",
	"ring-0 ring-fg transition-all hover:ring-2",
	"ring-offset-0 ring-offset-bg hover:ring-offset-2",
	"focus-visible:ring-offset-2 focus-visible:ring-2",
	"cursor-pointer active:cursor-pointer focusable",
);

function EventBubbleLink({
	event,
	organisations,
	...otherProps
}: EventBubbleLinkProps) {
	return (
		<TooltipTrigger asChild>
			<Link
				href={`/events/${event.event_id}`}
				className={bubbleClasses}
				style={{
					background: getCSSStyleGradient(organisations.map((x) => x.color)),
				}}
				{...otherProps}
			>
				<span className="sr-only">
					{`Protest by ${event.organizers.slice(0, 3).join(", ")}${
						event.organizers.length > 3
							? `and ${event.organizers.length - 3} more`
							: ""
					}: "${event.description.slice(0, 300)}${
						event.description.length > 300 ? "..." : ""
					}"`}
				</span>
			</Link>
		</TooltipTrigger>
	);
}

export function AggregatedEventsBubble({
	organisations,
}: {
	organisations: OrganisationType[];
}) {
	return (
		<span
			className={cn(bubbleClasses, "rounded-sm")}
			style={{
				background: getCSSStyleGradient(organisations.map((x) => x.color)),
			}}
		/>
	);
}

function getCSSStyleGradient(colors: string[]) {
	if (colors.length === 0) return;
	const uniqueColors = Array.from(new Set(colors));
	if (uniqueColors.length === 1) return uniqueColors[0];
	const stepPercentage = Math.round(100 / uniqueColors.length);
	return `linear-gradient(0deg, ${uniqueColors
		.map(
			(color, i) =>
				`${color} ${i * stepPercentage}%, ${color} ${
					(i + 1) * stepPercentage
				}%`,
		)
		.join(", ")})`;
}

export default memo(EventBubbleLink);
