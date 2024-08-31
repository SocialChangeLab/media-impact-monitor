import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { cn } from "@/utility/classNames";
import { getOrgStats } from "@/utility/orgsUtil";
import { texts } from "@/utility/textUtil";
import useEvents from "@/utility/useEvents";
import { createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";
import { DataTable } from "./DataTable/DataTable";
import InternalLink from "./InternalLink";
import OrgsTooltip from "./OrgsTooltip";
import RoundedColorPill from "./RoundedColorPill";

function formatNumber(num: number) {
	if (Number.isNaN(num)) return "?";
	return Math.round(num).toLocaleString(texts.language);
}

function OrganisationsTable() {
	const { data, isPending } = useEvents();
	const { organizers } = useFiltersStore((state) => ({
		organizers: state.organizers,
	}));

	const extendedData = useMemo(
		() =>
			data?.organisations
				.filter(
					(org) => organizers.length === 0 || organizers.includes(org.slug),
				)
				.map((org) =>
					getOrgStats({
						events: data.events,
						organisations: data.organisations,
						organisation: org,
					}),
				),
		[organizers, data],
	);

	const columns = useMemo(() => {
		const columnHelper = createColumnHelper<(typeof extendedData)[0]>();
		return [
			columnHelper.accessor("name", {
				header: texts.organisationsPage.propertyNames.name,
				cell: function render({ getValue, row }) {
					const { name, slug, color } = row.original;
					return (
						<InternalLink
							href={`/organisations/${slug}`}
							className={cn(
								"grid grid-cols-[auto_1fr_auto] gap-x-2 items-center",
								"hover:font-semibold transition-all w-fit focusable",
							)}
						>
							<RoundedColorPill color={color} />
							<div className="truncate underline-offset-4 underline decoration-grayMed">
								{name}
							</div>
						</InternalLink>
					);
				},
				size: 1000,
			}),
			columnHelper.accessor("totalEvents", {
				header: texts.organisationsPage.propertyNames.totalEvents,
				cell: function render({ getValue }) {
					return Math.round(getValue()).toLocaleString(texts.language);
				},
				size: 50,
			}),
			columnHelper.accessor("totalParticipants", {
				header: texts.organisationsPage.propertyNames.totalParticipants,
				cell: function render({ getValue }) {
					return formatNumber(getValue());
				},
				size: 50,
			}),
			columnHelper.accessor("avgParticipantsPerEvent", {
				header: texts.organisationsPage.propertyNames.avgParticipants,
				cell: function render({ getValue }) {
					return formatNumber(getValue());
				},
				size: 50,
			}),
			columnHelper.accessor("avgPartnerOrgsPerEvent", {
				header: texts.organisationsPage.propertyNames.avgPartners,
				cell: function render({ getValue }) {
					return formatNumber(getValue());
				},
				size: 50,
			}),
			columnHelper.accessor("totalPartners", {
				header: texts.organisationsPage.propertyNames.totalPartners,
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
								aria-label={texts.organisationsPage.showPartnersAriaLabel}
							>
								{formatNumber(getValue())}
							</button>
						</OrgsTooltip>
					);
				},
				size: 50,
			}),
		];
	}, []);

	if (!data) return null;

	return (
		<DataTable<(typeof extendedData)[0]>
			columns={columns}
			data={extendedData}
			isLoading={isPending ?? true}
		/>
	);
}

export default OrganisationsTable;
