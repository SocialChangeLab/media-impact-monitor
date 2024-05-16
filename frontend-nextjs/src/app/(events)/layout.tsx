import EventPageLayout from "@/components/EventPageLayout";
import type { ReactNode } from "react";

export default function EventsPageLayout({
	timeline,
	calendar,
	children,
}: { timeline: ReactNode; calendar: ReactNode; children: ReactNode }) {
	return (
		<EventPageLayout calendar={calendar}>
			{timeline}
			{children}
		</EventPageLayout>
	);
}
