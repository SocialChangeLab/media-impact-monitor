"use client";
import OrganisationsTable from "@/components/OrganisationsTable";
import SectionHeadlineWithExplanation from "@/components/SectionHeadlineWithExplanation";
import { useSearchParams } from "next/navigation";

export default function OrganisationsOverviewPage() {
	const searchParams = useSearchParams();
	return (
		<>
			<SectionHeadlineWithExplanation
				headline="Organisations Overview"
				description="An overview of the organisations that are part of the protests tracked by the Media Impact Monitor."
			>
				<OrganisationsTable />
			</SectionHeadlineWithExplanation>
		</>
	);
}
