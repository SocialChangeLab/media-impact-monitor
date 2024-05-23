import type { ReactNode } from "react";

export default function EventsPageLayout({
	timeline,
	children,
	mediaCoverage,
	mediaSentiment,
}: {
	timeline: ReactNode;
	mediaCoverage: ReactNode;
	mediaSentiment: ReactNode;
	children: ReactNode;
}) {
	return (
		<>
			{timeline}
			{mediaCoverage}
			{mediaSentiment}
			{children}
		</>
	);
}
