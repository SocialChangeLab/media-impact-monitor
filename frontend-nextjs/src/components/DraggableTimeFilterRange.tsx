import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { cn } from "@/utility/classNames";
import { useRanger, type Ranger } from "@tanstack/react-ranger";
import {
	addDays,
	differenceInDays,
	endOfDay,
	isSameDay,
	parse,
	startOfDay,
} from "date-fns";
import {
	useCallback,
	useEffect,
	useRef,
	useState,
	type MouseEvent as ReactMouseEvent,
	type TouchEvent as ReactTouchEvent,
} from "react";

type BtnMouseEvent = ReactMouseEvent<HTMLButtonElement>;
type BtnTouchEvent = ReactTouchEvent<HTMLButtonElement>;
type BtnEvent = BtnMouseEvent | BtnTouchEvent;

function DraggableTimeFilterRange() {
	const rangerRef = useRef<HTMLDivElement>(null);
	const midSegmentRef = useRef<HTMLButtonElement>(null);
	const datasetStartDate = parse("01-01-2020", "dd-MM-yyyy", new Date());
	const amountOfDays = Math.ceil(
		differenceInDays(new Date(), datasetStartDate) + 1,
	);
	const intervals = new Array(amountOfDays).fill(null).map((_, i) => {
		return addDays(datasetStartDate, i);
	});
	const { from, to, setDateRange } = useFiltersStore(
		({ from, to, setDateRange }) => ({ from, to, setDateRange }),
	);
	const indexOfFrom = intervals.findIndex((d) => isSameDay(d, from));
	const indexOfTo = intervals.findIndex((d) => isSameDay(d, to));
	const [values, setValues] = useState<ReadonlyArray<number>>([
		indexOfFrom,
		indexOfTo,
	]);
	const [tempValues, setTempValues] = useState<
		ReadonlyArray<number> | undefined
	>([indexOfFrom, indexOfTo]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const indexOfFrom = intervals.findIndex((d) => isSameDay(d, from));
		const indexOfTo = intervals.findIndex((d) => isSameDay(d, to));
		setValues([indexOfFrom, indexOfTo]);
		setTempValues([indexOfFrom, indexOfTo]);
	}, [from, to]);

	const onValuesChange = useCallback(
		(vals: [number, number]) => {
			const [from, to] = [intervals[vals[0]], intervals[vals[1]]]
				.sort((a, b) => {
					return a.getTime() - b.getTime();
				})
				.map((d) => d.getTime());

			setTempValues(vals);
			setDateRange({ from: startOfDay(from), to: endOfDay(to) });
		},
		[intervals, setDateRange],
	);

	const rangerInstance = useRanger<HTMLDivElement>({
		getRangerElement: () => rangerRef.current,
		values: tempValues || values,
		min: 0,
		max: intervals.length - 1,
		stepSize: 1,
		steps: intervals.map((_, i) => i),
		ticks: intervals.map((d) => d.getTime()),
		onChange: (instance: Ranger<HTMLDivElement>) => {
			const [fromIdx, toIdx] = instance.sortedValues;
			onValuesChange([fromIdx, toIdx]);
		},
		onDrag: (instance: Ranger<HTMLDivElement>) => {
			const [fromIdx, toIdx] = instance.sortedValues;
			setTempValues([fromIdx, toIdx]);
		},
	});

	const handleSegmentDrag = useCallback(
		(
			e: MouseEvent | TouchEvent,
			initialX: number,
			values: ReadonlyArray<number>,
		) => {
			let clientX = e instanceof MouseEvent ? e.clientX : 0;
			if (e instanceof TouchEvent) {
				clientX = e.changedTouches[0].clientX;
			}
			const initial = rangerInstance.getValueForClientX(initialX);
			const newValue = rangerInstance.getValueForClientX(clientX);
			const diff = newValue - initial;
			if (diff) {
				let actualDiff = 0;
				if (diff > 0) {
					const last = values[values.length - 1];
					const newRoundedLastValue = rangerInstance.roundToStep(last + diff);

					actualDiff = newRoundedLastValue - last;
				} else {
					const first = values[0];
					const newRoundedFirstValue = rangerInstance.roundToStep(first + diff);
					actualDiff = newRoundedFirstValue - first;
				}

				if (actualDiff) {
					return values.map((v) => v + actualDiff);
				}
			}
			return values;
		},
		[rangerInstance.getValueForClientX, rangerInstance.roundToStep],
	);

	const handleSegmentPress = useCallback(
		(e: BtnEvent) => {
			const clientX =
				e.type === "touchmove"
					? (e as BtnTouchEvent).changedTouches[0].clientX
					: (e as BtnMouseEvent).clientX;
			let tempVals = values;
			const onDrag = (e: MouseEvent | TouchEvent) => {
				tempVals = handleSegmentDrag(e, clientX, values);
				setTempValues(tempVals);
			};
			const handleRelease = (e: MouseEvent | TouchEvent) => {
				document.removeEventListener("mousemove", onDrag);
				document.removeEventListener("touchmove", onDrag);
				document.removeEventListener("mouseup", handleRelease);
				document.removeEventListener("touchend", handleRelease);
				const [fromIdx, toIdx] = tempVals || values;
				onValuesChange([fromIdx, toIdx]);
				onDrag(e);
			};

			document.addEventListener("mousemove", onDrag);
			document.addEventListener("touchmove", onDrag);
			document.addEventListener("mouseup", handleRelease);
			document.addEventListener("touchend", handleRelease);
		},
		[handleSegmentDrag, onValuesChange, values],
	);

	const handles = rangerInstance.handles();
	return (
		<div
			className={cn(
				`w-full h-7 border border-b-0 border-grayLight`,
				`rounded-t-md`,
			)}
		>
			<div
				ref={rangerRef}
				style={{
					position: "relative",
					userSelect: "none",
					height: "100%",
				}}
			>
				{rangerInstance.getSteps().map(({ left, width }, i) => (
					<button
						type="button"
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						key={`segment-${i}`}
						ref={i === 1 ? midSegmentRef : null}
						className={cn(
							`absolute h-full w-full left-0 top-0`,
							i === 1 && `ring-[1px] ring-grayMed`,
							i !== 1 && `bg-grayUltraLight mix-blend-multiply`,
						)}
						onMouseDown={(e) => handleSegmentPress(e)}
						onTouchStart={(e) => handleSegmentPress(e)}
						style={{ left: `${left}%`, width: `${width}%` }}
					/>
				))}
				{handles.map(
					(
						{
							value,
							onKeyDownHandler,
							onMouseDownHandler,
							onTouchStart,
							isActive,
						},
						i,
					) => (
						<button
							type="button"
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							key={i}
							onKeyDown={(e) => {
								e.preventDefault();
								onKeyDownHandler(e);
							}}
							onMouseDown={(e) => {
								e.preventDefault();
								onMouseDownHandler(e);
							}}
							onTouchStart={(e) => {
								e.preventDefault();
								onTouchStart(e);
							}}
							role="slider"
							aria-valuemin={rangerInstance.options.min}
							aria-valuemax={rangerInstance.options.max}
							aria-valuenow={value}
							className={cn(
								`w-4 h-[calc(100%+0.5rem+1px)] p-1`,
								`absolute top-1/2 -translate-x-1/2 -translate-y-1/2`,
								`focusable transition all`,
								`cursor-ew-resize`,
							)}
							style={{
								left: `${rangerInstance.getPercentageForValue(value)}%`,
								zIndex: isActive ? "1" : "0",
							}}
						>
							<span
								className={cn(
									`size-full relative bg-fg rounded-full transition hover:bg-grayDark`,
									`inline-block`,
								)}
							/>
						</button>
					),
				)}
			</div>
		</div>
	);
}

export default DraggableTimeFilterRange;
