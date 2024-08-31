import type {
	EventOrganizerSlugType,
	OrganisationType,
} from "@/utility/eventsUtil";
import { texts } from "@/utility/textUtil";
import useElementSize from "@custom-react-hooks/use-element-size";
import { type ScaleLinear, scaleLinear } from "d3-scale";
import CollapsableSection from "../CollapsableSection";
import DataCreditLegend from "../DataCreditLegend";
import OrgsLegend from "../OrgsLegend";
import EventsTimelineSizeLegend from "./EventsTimelineSizeLegend";
import useAggregationUnit from "./useAggregationUnit";

export type LegendOrganisation = Omit<OrganisationType, "count"> & {
	count?: number;
};

const placeholderOrganisations: LegendOrganisation[] = [
	{
		slug: "fridays-for-future" as EventOrganizerSlugType,
		name: "Fridays for Future",
		color: "var(--categorical-color-1)",
		isMain: true,
	},
	{
		slug: "last-generation" as EventOrganizerSlugType,
		name: "Last Generation",
		color: "var(--categorical-color-2)",
		isMain: true,
	},
	{
		slug: "extinction-rebellion" as EventOrganizerSlugType,
		name: "Extinction Rebellion",
		color: "var(--categorical-color-3)",
		isMain: true,
	},
	{
		slug: "bund" as EventOrganizerSlugType,
		name: "BUND",
		color: "var(--categorical-color-4)",
		isMain: true,
	},
	{
		slug: "greenpeace" as EventOrganizerSlugType,
		name: "Greenpeace",
		color: "var(--categorical-color-5)",
		isMain: true,
	},
	{
		slug: "verdi-united-services-union" as EventOrganizerSlugType,
		name: "Ver.di: United Services Union",
		color: "var(--categorical-color-6)",
		isMain: true,
	},
	{
		slug: "ende-gelaende" as EventOrganizerSlugType,
		name: "Ende Gelaende",
		color: "var(--categorical-color-7)",
		isMain: true,
	},
	{
		slug: "the-greens" as EventOrganizerSlugType,
		name: "The Greens",
		color: "var(--categorical-color-8)",
		isMain: true,
	},
	{
		slug: "mlpd-marxist-leninist-party-of-germany" as EventOrganizerSlugType,
		name: "MLPD: Marxist-Leninist Party of Germany",
		color: "var(--categorical-color-9)",
		isMain: true,
	},
	{
		slug: "the-left" as EventOrganizerSlugType,
		name: "The Left",
		color: "var(--categorical-color-10)",
		isMain: true,
	},
	{
		slug: "government-of-germany" as EventOrganizerSlugType,
		name: "Government of Germany",
		color: "var(--grayDark)",
		isMain: false,
	},
	{
		slug: "adfc-german-bicycle-club" as EventOrganizerSlugType,
		name: "ADFC: German Bicycle Club",
		color: "var(--categorical-color-11)",
		isMain: true,
	},
	{
		slug: "spd-social-democratic-party-of-germany" as EventOrganizerSlugType,
		name: "SPD: Social Democratic Party of Germany",
		color: "var(--categorical-color-12)",
		isMain: true,
	},
	{
		slug: "rebell-youth-league-rebel" as EventOrganizerSlugType,
		name: "REBELL: Youth League Rebel",
		color: "var(--categorical-color-14)",
		isMain: true,
	},
];

function EventsTimelineLegend({
	sizeScale = scaleLinear().domain([10, 100000]).range([10, 193.397]),
	selectedOrganisations = placeholderOrganisations,
}: {
	sizeScale?: ScaleLinear<number, number, never>;
	selectedOrganisations?: LegendOrganisation[];
}) {
	const [parentRef, { width }] = useElementSize();
	const aggregationUnit = useAggregationUnit(width);
	return (
		<div
			className="pt-10 flex flex-col gap-y-2 gap-x-[max(2rem,4vmax)] sm:grid sm:grid-cols-[1fr_auto] max-w-content"
			ref={parentRef}
		>
			<CollapsableSection
				title={texts.charts.common.legend}
				storageKey="protest-timeline-legend-expanded"
				storageType="session"
			>
				<div className="grid gap-[max(1rem,2vmax)] md:grid-cols-[auto_1fr]">
					<EventsTimelineSizeLegend
						sizeScale={sizeScale}
						aggragationUnit={aggregationUnit}
					/>
					<OrgsLegend organisations={selectedOrganisations} />
				</div>
			</CollapsableSection>
			<DataCreditLegend
				storageKey={"protest-timeline-data-credit-expanded"}
				sources={texts.charts.protest_timeline.data_credit}
			/>
		</div>
	);
}

export default EventsTimelineLegend;
