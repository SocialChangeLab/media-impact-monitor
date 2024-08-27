"use client";
import NewsletterFooterSection from "@/components/NewsletterFooterSection";
import OrganisationsTable from "@/components/OrganisationsTable";
import SectionHeadlineWithExplanation from "@/components/SectionHeadlineWithExplanation";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { format } from "@/utility/dateUtil";
import { isSameDay } from "date-fns";

export default function OrganisationsOverviewPage() {
	const description = useFiltersStore((state) => {
		const formattedFrom = format(state.from, "LLLL do, yyyy");
		const formattedTo = format(state.to, "LLLL do, yyyy");
		const formattedDate = isSameDay(state.from, state.to)
			? `on ${formattedFrom}`
			: `between ${formattedFrom} and ${formattedTo}`;
		const orgsCount = state.organizers.length;
		const organizersCount =
			orgsCount > 0
				? `the ${orgsCount} selected organisation${orgsCount > 1 ? "s" : ""}`
				: "all organisations";
		return `An overview of ${organizersCount} with protests ${formattedDate}. You can use the filters above to change the date range or select specific organisations.`;
	});
	return (
		<>
			<SectionHeadlineWithExplanation
				headline="Organisations Overview"
				description={description}
			>
				<OrganisationsTable />
			</SectionHeadlineWithExplanation>
			<NewsletterFooterSection />
		</>
	);
}
