import { endOfToday, parse, startOfDay } from "date-fns";
import type { EventOrganizerSlugType } from "./eventsUtil";
import useEvents from "./useEvents";

export function useOrganisations() {
	const { data, isPending } = useEvents({
		from: startOfDay(parse("01-01-2020", "dd-MM-yyyy", new Date())),
		to: endOfToday(),
	});

	return {
		organisations: data?.organisations ?? [],
		isPending,
	};
}

export function useOrganisation(slug: EventOrganizerSlugType | undefined) {
	const { organisations, isPending } = useOrganisations();

	return {
		organisation: slug
			? organisations.find(({ slug: s }) => s === slug)
			: undefined,
		isPending,
	};
}
