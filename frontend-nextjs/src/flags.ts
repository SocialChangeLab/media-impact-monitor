import { unstable_flag as flag } from "@vercel/flags/next";

export const showProtestsTimeline = flag({
	key: "protests-timeline",
	description: "Show the protests-timeline component(s)",
	decide: async () => false,
	defaultValue: false,
});

export const precomputeFlags = [showProtestsTimeline] as const;
