"use client";
import { FiltersStoreProvider } from "@/providers/FiltersStoreProvider";
import { useState } from "react";
import CustomQueryClientProvider from "../QueryClientProvider";
import { Button } from "../ui/button";
import ImpactChartRow from "./ImpactChartRow";
const getImpacts = () => [
	{
		impact: Math.random() * 100,
		uncertainty: Math.random(),
		label: "Climate science",
		color: "var(--categorical-color-1)",
	},
	{
		impact: Math.random() * 100,
		uncertainty: Math.random(),
		label: "Climate urgency",
		color: "var(--categorical-color-2)",
	},
	{
		impact: -1 * Math.random() * 100,
		uncertainty: Math.random(),
		label: "Climate policy",
		color: "var(--categorical-color-3)",
	},
];
function ImpactChartRowFixture() {
	const [impacts, setImpacts] = useState(getImpacts());
	return (
		<CustomQueryClientProvider>
			<FiltersStoreProvider>
				<div className="w-full h-full min-h-screen relative flex justify-center items-center p-8">
					<div className="border border-dashed border-grayLight p-8 rounded-lg bg-pattern-soft w-full max-w-screen-sm flex flex-col gap-12">
						<Button onClick={() => setImpacts(getImpacts())}>
							Randomise Bars
						</Button>
						<div className="grid grid-cols-1 gap-8 w-full">
							<ImpactChartRow
								impacts={impacts.map((i) => ({
									...i,
									totalBefore: Math.random() * 1000 + 400 + i.impact,
									uncertainty: i.uncertainty > 0.5 ? null : i.uncertainty,
								}))}
								unitLabel="articles and media"
								icon="LineChart"
							/>
						</div>
					</div>
				</div>
			</FiltersStoreProvider>
		</CustomQueryClientProvider>
	);
}

export default ImpactChartRowFixture;
