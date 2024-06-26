"use client";
import EventPageHeader from "@/components/EventPageHeader";
import MediaSentimentChart from "@/components/MediaSentimentChart";
import SectionHeadlineWithExplanation from "@/components/SectionHeadlineWithExplanation";
import { ResponsiveModal } from "@/components/ui/responsive-dialog";
import { useRouter } from "next/navigation";

function InderceptedEventPage({
	params: { id },
}: {
	params: { id: string };
}) {
	const router = useRouter();
	return (
		<ResponsiveModal
			open
			onClose={() => {
				try {
					router.back();
				} catch {
					router.push("/");
				}
			}}
		>
			<EventPageHeader id={id} />
			<SectionHeadlineWithExplanation
				headline="Media Timeline of Event"
				description="See the media sentiment of articles and media related to the event"
				help="See the media sentiment of articles and media related to the event"
			>
				<MediaSentimentChart />
			</SectionHeadlineWithExplanation>
		</ResponsiveModal>
	);
}

export default InderceptedEventPage;
