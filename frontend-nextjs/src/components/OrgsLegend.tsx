"use client";
import type {
	EventOrganizerSlugType,
	OrganisationType,
} from "@/utility/eventsUtil";
import { ArrowRight } from "lucide-react";
import { useMemo } from "react";
import OrgsLegendItem from "./OrgsLegendItem";

function getOtherOrg(organisations: OrganisationType[]) {
	return {
		slug: "other" as EventOrganizerSlugType,
		name: "Other",
		count: organisations.reduce((acc, org) => acc + org.count, 0),
		color: `var(--grayDark)`,
		isMain: false,
		orgs: organisations.sort((a, b) => {
			if (a.count > b.count) return -1;
			if (a.count < b.count) return 1;
			return a.name.localeCompare(b.name);
		}),
	};
}

function OrgsLegend({
	organisations,
}: {
	organisations: OrganisationType[];
}) {
	const { allOrgs, otherOrgs } = useMemo(() => {
		const mainOrgs: OrganisationType[] = [];
		const otherOrgs: OrganisationType[] = [];

		for (const org of organisations) {
			if (!org.isMain) otherOrgs.push(org);
			else mainOrgs.push(org);
		}

		if (mainOrgs.length === 0) {
			return {
				allOrgs: organisations
					.slice(0, 16)
					.concat(getOtherOrg(organisations.slice(16))),
				otherOrgs: organisations.slice(16),
			};
		}
		if (organisations.length < 16) {
			return { allOrgs: [...mainOrgs, ...otherOrgs], otherOrgs: [] };
		}
		if (otherOrgs.length === 0) return { allOrgs: mainOrgs, otherOrgs: [] };
		return {
			allOrgs: [...mainOrgs, getOtherOrg(otherOrgs)],
			otherOrgs,
		};
	}, [organisations]);

	if (allOrgs.length === 0) return null;
	return (
		<div className="flex flex-col gap-2">
			<h5 className="font-bold flex gap-1 items-center">
				<span>Color</span>
				<ArrowRight size={16} className="text-grayDark" />
				Organizations
			</h5>
			<ul className="grid grid-cols-[repeat(auto-fill,minmax(min(13rem,100%),1fr))] gap-x-6 relative z-20 legend-orgs-container">
				{allOrgs.map((org) => (
					<OrgsLegendItem key={org.slug} org={org} otherOrgs={otherOrgs} />
				))}
			</ul>
		</div>
	);
}

export default OrgsLegend;
