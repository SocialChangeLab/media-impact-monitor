import RoundedColorPill from "@/components/RoundedColorPill";
import {
	FlameIcon,
	FrownIcon,
	MehIcon,
	OrbitIcon,
	ScrollIcon,
	SmileIcon,
	VoteIcon,
} from "lucide-react";
import slugify from "slugify";

const sentiments = ["positive", "negative", "neutral"];

export function getTopicColor(topic: string) {
	const slugified = slugify(topic, { lower: true, strict: true });
	if (topicIsSentiment(topic)) return `var(--sentiment-${slugified})`;
	return `var(--keyword-${slugified})`;
}

export function topicIsSentiment(topic: string) {
	return sentiments.includes(slugify(topic, { lower: true, strict: true }));
}

export function getTopicIcon(topic: string) {
	const slugified = slugify(topic, { lower: true, strict: true });
	if (slugified === "climate-activism") return VoteIcon;
	if (slugified === "climate-crisis-framing") return FlameIcon;
	if (slugified === "climate-policy") return ScrollIcon;
	if (slugified === "climate-science") return OrbitIcon;
	if (slugified === "positive") return SmileIcon;
	if (slugified === "negative") return FrownIcon;
	if (slugified === "neutral") return MehIcon;
	return RoundedColorPill;
}
