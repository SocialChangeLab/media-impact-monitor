import type { ScalePower } from "d3-scale";
import { Fragment, useMemo } from "react";

function EventsTimelineSizeLegend({
	sizeScale,
}: {
	sizeScale: ScalePower<number, number>;
}) {
	const exampleSizes = useMemo(() => {
		const min = 10;
		const max = Math.max(sizeScale.domain()[1], 30);
		const mid = Math.floor((min + max) / 2);
		return [undefined, min, mid, max].map((x, idx) => ({
			id: idx,
			size: x,
			height: sizeScale(x ?? 0),
		}));
	}, [sizeScale]);

	return (
		<div className="flex flex-col gap-2">
			<h5 className="font-bold">Size</h5>
			<div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 items-center">
				{exampleSizes.map(({ id, size, height }) => (
					<Fragment key={id}>
						<div className="rounded-full bg-grayDark w-3" style={{ height }} />
						<span>
							{size
								? `${size.toLocaleString("en-GB")} participants`
								: "0 or unknown amount of participants"}
						</span>
					</Fragment>
				))}
			</div>
		</div>
	);
}

export default EventsTimelineSizeLegend;
