"use client";
import EventPageContent from "@/components/EventPageContent";
import { ResponsiveModal } from "@/components/ui/responsive-dialog";
import { usePathname, useRouter } from "next/navigation";

function InderceptedEventPage({
	params: { id },
}: {
	params: { id: string };
}) {
	const pathname = usePathname();
	const router = useRouter();
	const isOpened = pathname === `/events/${id}`;
	return (
		<ResponsiveModal
			open={isOpened}
			onClose={() => {
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
