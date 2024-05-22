import type { ReactNode } from "react";

export default function EventsPageLayout({
	timeline,
	children,
	mediaCoverage,
}: {
	timeline: ReactNode;
	mediaCoverage: ReactNode;
	children: ReactNode;
}) {
	return (
		<>
			{timeline}
			{mediaCoverage}
			{children}
		</>
	);
}
