"use client";
import { randomInRange, randomUntil } from "@/utility/randomUtil";
import { useState } from "react";
import { Button } from "../ui/button";
import ImpactChartRow from "./ImpactChartRow";
const getImpacts = () => [
	{
		impact: randomUntil(100, false),
		uncertainty: Math.random(),
		label: "Climate science",
		color: "var(--categorical-color-1)",
	},
	{
		impact: randomUntil(100, false),
		uncertainty: Math.random(),
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
function ImpactChartRowFixture() {
	const [impacts, setImpacts] = useState(getImpacts());
	return (
		<div className="w-full h-full min-h-screen relative flex justify-center items-center p-8">
			<div className="border border-dashed border-grayLight p-8 rounded-lg bg-pattern-soft w-full max-w-screen-sm flex flex-col gap-12">
				<Button onClick={() => setImpacts(getImpacts())}>Randomise Bars</Button>
				<div className="grid grid-cols-1 gap-8 w-full">
					<ImpactChartRow
						impacts={impacts.map((i) => ({
							...i,
							totalBefore: randomInRange(400, 1000, false) + i.impact,
							uncertainty: i.uncertainty > 0.5 ? null : i.uncertainty,
						}))}
						unitLabel="articles and media"
						icon="LineChart"
					/>
				</div>
			</div>
		</div>
	);
}

export default ImpactChartRowFixture;
