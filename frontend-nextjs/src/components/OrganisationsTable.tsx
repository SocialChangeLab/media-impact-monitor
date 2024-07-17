import { cn } from "@/utility/classNames";
import type {
	EventOrganizerSlugType,
	OrganisationType,
} from "@/utility/eventsUtil";
import useEvents from "@/utility/useEvents";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { DataTable } from "./DataTable/DataTable";
import OrgsTooltip from "./OrgsTooltip";
import RoundedColorPill from "./RoundedColorPill";

function formatNumber(num: number) {
	if (Number.isNaN(num)) return "?";
	return Math.round(num).toLocaleString("en-GB");
}

function OrganisationsTable() {
	const { data } = useEvents();
	const searchParams = useSearchParams();

	const extendedData = useMemo(
		() =>
			data?.organisations.map((org) => {
				const orgEvents = data.events.filter((e) =>
					e.organizers.find((o) => o.slug === org.slug),
				);
				const totalEvents = orgEvents.length ?? 0;
				const totalParticipants = orgEvents.reduce(
					(acc, e) => acc + (e.size_number ?? 0),
					0,
				);
				const partners = Array.from(
					orgEvents
						.reduce((acc, e) => {
							for (const partner of e.organizers) {
								if (partner.slug === org.slug) continue;
								const partnerOrg = data.organisations.find(
									(o) => o.slug === partner.slug,
								);
								if (!partnerOrg) continue;
								acc.set(partner.slug, partnerOrg);
							}
							return acc;
						}, new Map<EventOrganizerSlugType, OrganisationType>())
						.values(),
				);
				return {
					...org,
					slug: org.slug,
					name: org.name,
					totalEvents: totalEvents,
					totalParticipants,
					avgParticipantsPerEvent:
						totalEvents === 0 ? 0 : totalParticipants / totalEvents,
					avgPartnerOrgsPerEvent:
						totalEvents === 0 ? 0 : partners.length / totalEvents,
					totalPartners: partners.length,
					partners,
				};
			}),
		[data],
	);

	const columns = useMemo(() => {
		const columnHelper = createColumnHelper<(typeof extendedData)[0]>();
		return [
			columnHelper.accessor("name", {
				header: "Name",
				cell: function render({ getValue, row }) {
					const { name, slug, color } = row.original;
					return (
						<Link
							href={`/organisations/${slug}?${searchParams.toString()}`}
							className={cn(
								"grid grid-cols-[auto_1fr_auto] gap-x-2 items-center",
								"hover:font-semibold transition-all w-fit focusable",
							)}
						>
							<RoundedColorPill color={color} />
							<div className="truncate underline-offset-4 underline decoration-grayMed">
								{name}
							</div>
						</Link>
					);
				},
				size: 1000,
			}),
			columnHelper.accessor("totalEvents", {
				header: "Total Events",
				cell: function render({ getValue }) {
					return Math.round(getValue()).toLocaleString("en-GB");
				},
				size: 50,
			}),
			columnHelper.accessor("totalParticipants", {
				header: "Total Participants",
				cell: function render({ getValue }) {
					return formatNumber(getValue());
				},
				size: 50,
			}),
			columnHelper.accessor("avgParticipantsPerEvent", {
				header: "Avg. Participants",
				cell: function render({ getValue }) {
					return formatNumber(getValue());
				},
				size: 50,
			}),
			columnHelper.accessor("avgPartnerOrgsPerEvent", {
				header: "Avg. Partners",
				cell: function render({ getValue }) {
					return formatNumber(getValue());
				},
				size: 50,
			}),
			columnHelper.accessor("totalPartners", {
				header: "Total Partners",
				cell: function render({ getValue, row }) {
					const partners = row.original.partners.sort((a, b) => {
						if (a.count < b.count) return 1;
						if (a.count > b.count) return -1;
						return a.name.localeCompare(b.name);
					});
					if (partners.length === 0) return <span>0</span>;
					return (
						<OrgsTooltip otherOrgs={partners} withPills>
							<button
								type="button"
								className="underline underline-offset-4 decoration-grayMed cursor-pointer focusable"
								aria-label="Show partners tooltip"
							>
								{formatNumber(getValue())}
							</button>
						</OrgsTooltip>
					);
				},
				size: 50,
			}),
		];
	}, [searchParams]);

	if (!data) return null;

	return (
		<DataTable<(typeof extendedData)[0]>
			columns={columns}
			data={extendedData}
		/>
	);
}

export default OrganisationsTable;
