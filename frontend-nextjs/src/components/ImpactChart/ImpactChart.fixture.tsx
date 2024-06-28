"use client";

import Providers from "@/appProviders";
import useDebounce from "@custom-react-hooks/use-debounce";
import { useState } from "react";
import { Button } from "../ui/button";
import ImpactChart from "./ImpactChart";

let idInc = 0;
const getImpact = (maxImpact: number) =>
	Math.random() * (Math.random() < 0.5 ? maxImpact : -maxImpact);
const getUncertainty = () => {
	const uncertainty = Math.random();
	return uncertainty > 0.8 ? null : uncertainty;
};
const getImpactColumn = (maxImpact: number, id: string) => ({
	id,
	data: [
		{
			impact: getImpact(maxImpact),
			uncertainty: getUncertainty(),
			label: "Climate science",
			color: "var(--categorical-color-1)",
			uniqueId: `impact-${idInc++}`,
		},
		{
			impact: getImpact(maxImpact),
			uncertainty: getUncertainty(),
			label: "Climate urgency",
			color: "var(--categorical-color-2)",
			uniqueId: `impact-${idInc++}`,
		},
		{
			impact: getImpact(maxImpact),
			uncertainty: getUncertainty(),
			label: "Climate policy",
			color: "var(--categorical-color-3)",
			uniqueId: `impact-${idInc++}`,
		},
	],
});

const getImpactColumns = (maxImpact: number) => [
	getImpactColumn(maxImpact, `column-1`),
	getImpactColumn(maxImpact, `column-2`),
	getImpactColumn(maxImpact, `column-3`),
	getImpactColumn(maxImpact, `column-4`),
];

function ImpactChartFixture() {
	const [maxImpact, setMaxImpact] = useState(100);
	const [columns, setColumns] = useState(getImpactColumns(maxImpact));
	const [updateColumns] = useDebounce(
		() => {
			setColumns(getImpactColumns(maxImpact));
		},
		100,
		{
			leading: true,
			trailing: true,
		},
	);
	return (
		<Providers>
			<div className="w-full h-screen flex justify-center items-center p-8">
				<div className="border border-dashed border-grayLight p-8 rounded-lg bg-pattern-soft w-full flex flex-col gap-12">
					<div className="flex gap-6">
						<Button onClick={updateColumns}>Randomise Bars</Button>
						<label htmlFor="maxImpact" className="flex flex-col">
							<span>Max impact: {maxImpact.toLocaleString()}</span>
							<input
								className="accent-fg w-40"
								id="maxImpact"
								type="range"
								min={100}
								max={10000}
								step={100}
								value={maxImpact}
								onChange={(e) => {
									const newMaxImpact = Number.parseInt(e.target.value, 10);
									setMaxImpact(newMaxImpact);
									updateColumns();
								}}
							/>
						</label>
					</div>
					<ImpactChart
						columns={columns}
						unitLabel="articles and media"
						icon="LineChart"
					/>
				</div>
			</div>
		</Providers>
	);
}

export default ImpactChartFixture;
