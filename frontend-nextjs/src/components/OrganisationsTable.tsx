import useEvents from "@/utility/useEvents";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { DataTable } from "./DataTable/DataTable";
import RoundedColorPill from "./RoundedColorPill";

function OrganisationsTable() {
	const { data } = useEvents();
	const searchParams = useSearchParams();

	const extendedData = useMemo(
		() =>
			data?.organisations.map((org) => {
				const orgEvents = data.events.filter((e) =>
					e.organizers.find((o) => o.slug === org.slug),
				);
				const totalParticipants = orgEvents.reduce(
					(acc, e) => acc + (e.size_number ?? 0),
					0,
				);
				return {
					...org,
					slug: org.slug,
					name: org.name,
					totalEvents: orgEvents.length,
					totalParticipants,
					avgParticipantsPerEvent: totalParticipants / orgEvents.length,
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
							href={`/organisations/${slug}${searchParams && `?${searchParams.toString()}`}`}
							className={"grid grid-cols-[auto_1fr_auto] gap-x-2 items-center"}
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
					return Math.round(getValue()).toLocaleString("en-GB");
				},
				size: 50,
			}),
			columnHelper.accessor("avgParticipantsPerEvent", {
				header: "Avg. Participants per Event",
				cell: function render({ getValue }) {
					return Math.round(getValue()).toLocaleString("en-GB");
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
