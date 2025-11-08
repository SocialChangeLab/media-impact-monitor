import RoundedColorPill from "@/components/RoundedColorPill";
import {
	FlameIcon,
	FrownIcon,
	HeartHandshakeIcon,
	LandmarkIcon,
	MapPinIcon,
	MegaphoneIcon,
	MehIcon,
	OrbitIcon,
	ScaleIcon,
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
	
	// Climate topics
	if (slugified === "climate-activism") return VoteIcon;
	if (slugified === "climate-crisis-framing") return FlameIcon;
	if (slugified === "climate-policy") return ScrollIcon;
	if (slugified === "climate-science") return OrbitIcon;
	
	// Gaza topics
	if (slugified === "gaza-general") return MapPinIcon;
	if (slugified === "gaza-humanitarian") return HeartHandshakeIcon;
	if (slugified === "gaza-justice") return ScaleIcon;
	if (slugified === "gaza-political") return LandmarkIcon;
	if (slugified === "gaza-activism") return MegaphoneIcon;
	
	// Sentiment topics
	if (slugified === "positive") return SmileIcon;
	if (slugified === "negative") return FrownIcon;
	if (slugified === "neutral") return MehIcon;
	
	return RoundedColorPill;
}
