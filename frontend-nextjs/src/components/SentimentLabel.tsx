import { Frown, HelpCircle, Meh, Smile } from "lucide-react";

const positiveMin = 0.8;
const negativeMax = 0.2;

function SentimentLabel({ sentiment }: { sentiment?: number }) {
	const sentimentLabel = getSentimentLabel(sentiment);
	const icon = getSentimentIcon(sentiment);
	return (
		<div className="flex items-center gap-2">
			{icon}
			<span className="text-sm text-grayDark">
				{sentimentLabel}
				{sentiment && ` (${sentiment.toFixed(2)})`}
			</span>
		</div>
	);
}

export default SentimentLabel;

function getSentimentLabel(sentiment?: number) {
	if (sentiment === undefined) return "Unknown";
	if (sentiment < negativeMax) return "Negative";
	if (sentiment > positiveMin) return "Positive";
	return "Neutral";
}

function getSentimentColor(sentiment?: number) {
	if (sentiment === undefined) return "text-grayMed";
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
