"use client";
import OrganisationPageContent from "@/components/OrganisationPageContent";
import { ResponsiveModal } from "@/components/ui/responsive-dialog";
import type { EventOrganizerSlugType } from "@/utility/eventsUtil";
import { useRouter } from "next/navigation";

function InderceptedEventPage({
	params: { slug },
}: {
	params: { slug: EventOrganizerSlugType };
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
			<OrganisationPageContent slug={slug} />
		</ResponsiveModal>
	);
}

export default InderceptedEventPage;
