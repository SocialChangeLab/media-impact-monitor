import { summarizeEvents } from "./eventsUtil";

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
	const orgEvents = events.filter((e) =>
		e.organizers.find((o) => o.slug === org.slug),
	);
	const { eventCount: totalEvents, knownSize, unknownSizeCount } = summarizeEvents(orgEvents);
	const totalParticipants = knownSize ?? Number.NaN;
	const knownSizeEvents = totalEvents - unknownSizeCount;
	const partners = Array.from(
		orgEvents
			.reduce((acc, e) => {
				for (const partner of e.organizers) {
					if (partner.slug === org.slug) continue;
					const partnerOrg = organisations.find(
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
		avgParticipantsPerEvent: knownSizeEvents > 0 ? Math.ceil(totalParticipants / knownSizeEvents) : Number.NaN,
		totalPartners: partners.length,
		partners,
	};
}
