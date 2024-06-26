"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import ImpactBar from "./ImpactBar";

const getImpacts = (negative = false) => [
	{
		impact: Math.random() * (negative ? -100 : 100),
		uncertainty: Math.random(),
		label: "Climate science",
		color: "var(--categorical-color-1)",
	},
	{
		impact: Math.random() * (negative ? -100 : 100),
		uncertainty: Math.random(),
		label: "Climate urgency",
		color: "var(--categorical-color-2)",
	},
	{
		impact: Math.random() * (negative ? -100 : 100),
		uncertainty: Math.random(),
		label: "Climate policy",
		color: "var(--categorical-color-3)",
	},
];

export default function ImpactBarFixture() {
	const [negative, setNegative] = useState(false);
	const [impacts, setImpacts] = useState(getImpacts(negative));
	return (
		<div className="border border-dashed border-grayLight p-8 rounded-lg bg-pattern-soft w-full max-w-screen-sm flex flex-col gap-12">
			<div className="flex gap-6">
				<Button
					onClick={() => {
						const newNegative = !negative;
						setNegative(newNegative);
						setImpacts(getImpacts(newNegative));
					}}
				>
					Toggle Negative
				</Button>
				<Button onClick={() => setImpacts(getImpacts(negative))}>
					Randomise Bars
				</Button>
			</div>
			<div
				className="grid grid-cols-5 gap-8 w-full group"
				style={{ height: 372, paddingTop: 64, paddingBottom: 64 }}
			>
				{impacts.map(({ impact, color, uncertainty, label }) => (
					<ImpactBar
						key={label}
						impact={impact}
						color={color}
						uncertainty={uncertainty}
						uniqueId={label}
						totalHeight={240}
					/>
				))}
			</div>
		</div>
	);
}
