"use client";
import { randomUntil } from "@/utility/randomUtil";
import ImpactBarsGroup from "./ImpactBarsGroup";

const impacts = [
	{
		impact: randomUntil(100, false),
		uncertainty: Math.random(),
		label: "Climate science",
		color: "var(--categorical-color-1)",
	},
	{
		impact: randomUntil(100, false),
		uncertainty: null,
		label: "Climate urgency",
		color: "var(--categorical-color-2)",
	},
	{
		impact: -1 * randomUntil(100, false),
		uncertainty: Math.random(),
		label: "Climate policy",
		color: "var(--categorical-color-3)",
	},
];

function ImpactBarsGroupFixture() {
	const impactsWithUncertainty = impacts
		.filter(({ uncertainty }) => uncertainty !== null)
		.map(({ impact }) => impact);
	const highestImpact = Math.max(...impactsWithUncertainty);
	const lowestImpact = Math.min(...impactsWithUncertainty);
	return (
		<div className="w-full h-full min-h-screen relative flex justify-center items-center p-8">
			<div className="border border-dashed border-grayLight p-8 rounded-lg bg-pattern-soft grid grid-cols-1 gap-8 w-full max-w-screen-sm">
				<ImpactBarsGroup
					total={impactsWithUncertainty.reduce(
						(acc, impact) => acc + Math.abs(impact),
						0,
					)}
					unitLabel="articles and media"
					icon="LineChart"
					highestImpact={highestImpact}
					lowestImpact={lowestImpact}
					impacts={impacts}
				/>
			</div>
		</div>
	);
}

export default ImpactBarsGroupFixture;
