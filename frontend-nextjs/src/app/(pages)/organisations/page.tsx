"use client";
import NewsletterFooterSection from "@/components/NewsletterFooterSection";
import OrganisationsTable from "@/components/OrganisationsTable";
import SectionHeadlineWithExplanation from "@/components/SectionHeadlineWithExplanation";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { format } from "@/utility/dateUtil";
import { texts } from "@/utility/textUtil";
import { isSameDay } from "date-fns";

export default function OrganisationsOverviewPage() {
	const description = useFiltersStore((state) => {
		const formattedFrom = format(state.from, "LLLL do, yyyy");
		const formattedTo = format(state.to, "LLLL do, yyyy");
		return texts.organisationsPage.description({
			isSameDay: isSameDay(state.from, state.to),
			formattedFrom,
			formattedTo,
			orgsCount: state.organizers.length,
		});
	});
	return (
		<>
			<SectionHeadlineWithExplanation
				headline={texts.organisationsPage.heading}
				description={description}
			>
				<OrganisationsTable />
			</SectionHeadlineWithExplanation>
			<NewsletterFooterSection />
		</>
	);
}
