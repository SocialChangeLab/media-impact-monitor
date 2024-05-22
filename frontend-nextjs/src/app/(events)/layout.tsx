import type { ReactNode } from "react";

export default function EventsPageLayout({
	timeline,
	children,
	mediaSentiment,
}: {
	timeline: ReactNode;
	mediaSentiment: ReactNode;
	children: ReactNode;
}) {
	return (
		<>
			{timeline}
			{mediaSentiment}
			{children}
		</>
	);
}
