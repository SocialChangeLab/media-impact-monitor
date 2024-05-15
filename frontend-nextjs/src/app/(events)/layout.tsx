import EventPageLayout from "@/components/EventPageLayout";
import LoadingEventsTimeline from "@/components/EventsTimeline/LoadingEventsTimeline";
import { type PropsWithChildren, type ReactNode, Suspense } from "react";

export default function EventsPageLayout({
	children,
	timeline,
	table,
}: PropsWithChildren<{
	children: ReactNode;
	timeline: ReactNode;
	table: ReactNode;
}>) {
	return (
		<EventPageLayout>
			{children}
			<div className="flex flex-col gap-4">
				<Suspense fallback={<LoadingEventsTimeline />}>{timeline}</Suspense>
			</div>
			<div className="flex flex-col gap-4 pt-8">
				<Suspense fallback={<div>Loading...</div>}>{table}</Suspense>
			</div>
		</EventPageLayout>
	);
}
