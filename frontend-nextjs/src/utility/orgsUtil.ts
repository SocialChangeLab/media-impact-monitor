import type {
	EventOrganizerSlugType,
	OrganisationType,
	ParsedEventType,
} from "./eventsUtil";

export function getOrgStats(data: {
	events: ParsedEventType[];
	organisations: OrganisationType[];
	organisation: OrganisationType;
}) {
	const { events, organisations, organisation: org } = data;
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
}
