"use client";
import type { OrganisationType } from "@/utility/eventsUtil";
import { useMemo } from "react";
import OrgsLegendItem from "./OrgsLegendItem";

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

		if (otherOrgs.length === 0) return { allOrgs: mainOrgs, otherOrgs: [] };
		return {
			allOrgs: [
				...mainOrgs,
				{
					name: "Other",
					count: otherOrgs.reduce((acc, org) => acc + org.count, 0),
					color: `var(--grayDark)`,
					isMain: false,
					orgs: otherOrgs.sort((a, b) => {
						if (a.count > b.count) return -1;
						if (a.count < b.count) return 1;
						return a.name.localeCompare(b.name);
					}),
				},
			],
			otherOrgs,
			mainOrgs,
		};
	}, [organisations]);

	if (allOrgs.length === 0) return null;
	return (
		<div className="flex flex-col gap-2">
			<h5 className="font-bold">Color</h5>
			<ul className="grid grid-cols-[repeat(auto-fill,minmax(min(15rem,100%),1fr))] gap-x-6 relative z-20">
				{allOrgs.map((org) => (
					<OrgsLegendItem key={org.name} org={org} otherOrgs={otherOrgs} />
				))}
			</ul>
		</div>
	);
}

export default OrgsLegend;
