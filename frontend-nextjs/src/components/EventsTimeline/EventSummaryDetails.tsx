import { summarizeEvents, type ParsedEventType } from "@/utility/eventsUtil";
import { texts } from "@/utility/textUtil";

export default function EventSummaryDetails({ events }: { events: ParsedEventType[] }) {
	const { eventCount, knownSize, unknownSizeCount } = summarizeEvents(events);
	const copy = texts.charts.protest_timeline().tooltips;
	return (
		<div className="max-w-80 px-4 pb-3 text-xs space-y-1">
			<p>{copy.eventCount(eventCount)}</p>
			<p>{copy.knownTotal}: {knownSize === null ? copy.unknownTotal : knownSize.toLocaleString(texts.language)}</p>
			<p>{copy.missingSizes(unknownSizeCount, eventCount)}</p>
		</div>
	);
}
