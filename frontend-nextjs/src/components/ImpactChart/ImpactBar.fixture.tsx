import { seededRandom } from "@/utility/randomUtil";
import ImpactBar from "./ImpactBar";

const impactBars = Array.from({ length: 10 }, (_, i) => i + 1).map((i) => ({
	impact: seededRandom() * (i > 5 ? -1 : 1),
	color: `var(--categorical-color-${i + 1})`,
	uncertainty: i % 4 === 0 ? null : seededRandom(),
	uniqueId: `impact-bar-${i}`,
}));

function ImpactBarFixture({ bars }: { bars: typeof impactBars }) {
	return (
		<div className="w-full h-full min-h-screen relative flex justify-center items-center p-8">
			<div
				className="border border-dashed border-grayLight p-8 rounded-lg bg-pattern-soft grid grid-cols-5 gap-8 w-full max-w-screen-sm group"
				style={{ height: 372, paddingTop: 64, paddingBottom: 64 }}
			>
				{bars.map(({ impact, color, uncertainty, uniqueId }) => (
					<ImpactBar
						key={uniqueId}
						impact={impact}
						color={color}
						uncertainty={uncertainty}
						uniqueId={uniqueId}
						totalHeight={240}
						padding={32}
					/>
				))}
			</div>
		</div>
	);
}

export default {
	"Positive Impact": <ImpactBarFixture bars={impactBars.slice(0, 5)} />,
	"Negative Impact": <ImpactBarFixture bars={impactBars.slice(5)} />,
};
