"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import ImpactBarsGroup from "./ImpactBarsGroup";

const getImpacts = () => [
	{
		impact: Math.random() * 100,
		uncertainty: Math.random(),
		label: "Climate science",
		color: "var(--categorical-color-1)",
	},
	{
		impact: Math.random() * 100,
		uncertainty: null,
		label: "Climate urgency",
		color: "var(--categorical-color-2)",
	},
	{
		impact: Math.random() * -100,
		uncertainty: Math.random(),
		label: "Climate policy",
		color: "var(--categorical-color-3)",
	},
];

function ImpactBarsGroupFixture() {
	const [impacts, setImpacts] = useState(getImpacts());
	const impactsWithUncertainty = impacts
		.filter(({ uncertainty }) => uncertainty !== null)
		.map(({ impact }) => Math.abs(impact));
	const highestImpact = Math.max(...impactsWithUncertainty);
	const lowestImpact = Math.min(...impactsWithUncertainty);
	return (
		<div className="w-full h-full min-h-screen relative flex justify-center items-center p-8">
			<div className="border border-dashed border-grayLight p-8 rounded-lg bg-pattern-soft w-full max-w-screen-sm flex flex-col gap-12">
				<Button onClick={() => setImpacts(getImpacts())}>Randomise Bars</Button>
				<div className="grid grid-cols-1 gap-8 w-full">
					<ImpactBarsGroup
						total={1000}
						highestImpact={highestImpact}
						lowestImpact={lowestImpact}
						impacts={impacts}
					/>
				</div>
			</div>
		</div>
	);
}

export default ImpactBarsGroupFixture;
