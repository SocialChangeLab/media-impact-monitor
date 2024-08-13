import type { ParsedMediaImpactItemType } from "@/utility/mediaImpactUtil";

function ImpactChartColumnVisualisation({
	impacts,
	limitations,
	error,
	isPending = false,
}: {
	impacts: ParsedMediaImpactItemType[] | null;
	limitations?: string[];
	error?: Error | null;
	isPending?: boolean;
}) {
	return (
		<ImpactChartColumnVisualisationWrapper>
			{isPending && <div>Loading...</div>}
		</ImpactChartColumnVisualisationWrapper>
	);
}

function ImpactChartColumnVisualisationWrapper({
	children,
}: { children: React.ReactNode }) {
	return <div className="bg-grayUltraLight">{children}</div>;
}

export default ImpactChartColumnVisualisation;
