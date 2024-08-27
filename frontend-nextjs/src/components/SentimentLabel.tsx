"use client";
import { Frown, HelpCircle, Meh, Smile } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const positiveMin = 0.8;
const negativeMax = 0.2;

function Label({ sentiment }: { sentiment?: number }) {
	const sentimentLabel = getSentimentLabel(sentiment);
	const icon = getSentimentIcon(sentiment);
	return (
		<span className="flex items-center gap-2">
			{icon}
			<span className="text-sm text-grayDark">{sentimentLabel}</span>
		</span>
	);
}

function SentimentLabel({ sentiment }: { sentiment?: number }) {
	if (!sentiment) return <Label />;
	return (
		<Tooltip delayDuration={50}>
			<TooltipTrigger>
				<Label sentiment={sentiment} />
			</TooltipTrigger>
			<TooltipContent className="w-fit">{sentiment.toFixed(2)}</TooltipContent>
		</Tooltip>
	);
}

export default SentimentLabel;

export function getSentimentLabel(sentiment?: number | null) {
	if (sentiment === undefined || sentiment === null) return "Unknown";
	if (sentiment < negativeMax) return "Negative";
	if (sentiment > positiveMin) return "Positive";
	return "Neutral";
}

function getSentimentColor(sentiment?: number | null) {
	if (sentiment === undefined || sentiment === null) return "text-grayMed";
	if (sentiment < negativeMax) return "text-sentimentNegative";
	if (sentiment > positiveMin) return "text-sentimentPositive";
	return "text-sentimentNeutral";
}

function getSentimentIcon(sentiment?: number) {
	const commonProps = { size: 20, className: getSentimentColor(sentiment) };
	if (sentiment === undefined) return <HelpCircle {...commonProps} />;
	if (sentiment < negativeMax) return <Frown {...commonProps} />;
	if (sentiment > positiveMin) return <Smile {...commonProps} />;
	return <Meh {...commonProps} />;
}
