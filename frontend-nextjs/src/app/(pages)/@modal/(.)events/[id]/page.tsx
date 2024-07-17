"use client";
import EventPageContent from "@/components/EventPageContent";
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
			initialOpen
			onUnmountEnd={() => {
				try {
					router.back();
				} catch {
					router.push("/");
				}
			}}
		>
			<EventPageContent id={id} />
		</ResponsiveModal>
	);
}

export default InderceptedEventPage;
