import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { useToday } from "@/providers/TodayProvider";
import { cn } from "@/utility/classNames";
import {
	type ComparableDateItemType,
	dateToComparableDateItem,
} from "@/utility/comparableDateItemSchema";
import { format } from "@/utility/dateUtil";
import useEvents from "@/utility/useEvents";
import { isInSameAggregationUnit } from "@/utility/useTimeIntervals";
import useDebounce from "@custom-react-hooks/use-debounce";
import useElementSize from "@custom-react-hooks/use-element-size";
import { type Ranger, useRanger } from "@tanstack/react-ranger";
import { addDays, compareAsc, differenceInDays } from "date-fns";
import {
	type KeyboardEvent as ReactKeyboardEvent,
	type MouseEvent as ReactMouseEvent,
	type TouchEvent as ReactTouchEvent,
	memo,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import useTimelineEvents from "./EventsTimeline/useTimelineEvents";

type BtnMouseEvent = ReactMouseEvent<HTMLButtonElement>;
type BtnTouchEvent = ReactTouchEvent<HTMLButtonElement>;
type BtnEvent = BtnMouseEvent | BtnTouchEvent;

function DraggableTimeFilterRange() {
	const rangerRef = useRef<HTMLDivElement>(null);
	const midSegmentRef = useRef<HTMLButtonElement>(null);
	const { from, to, setDateRange } = useFiltersStore((state) => ({
		from: dateToComparableDateItem(state.from),
		to: dateToComparableDateItem(state.to),
		setDateRange: state.setDateRange,
	}));
	const { today, datasetStartDate, datasetEndDate } = useToday();
	const amountOfDays = differenceInDays(datasetEndDate, datasetStartDate) + 1;
	const intervals = new Array(Math.abs(amountOfDays))
		.fill(null)
		.map((_, i) =>
			dateToComparableDateItem(addDays(datasetStartDate, i), today),
		);

	const rangerSteps = intervals.map((_, i) => i);
	const rangerTicks = intervals.map((d) => d.time);
	const indexOfFrom = useMemo(
		() =>
			intervals.findIndex((d) =>
				isInSameAggregationUnit("day", d, from),
			),
		[from, intervals],
	);
	const indexOfTo = useMemo(
		() =>
			intervals.findIndex((d) =>
				isInSameAggregationUnit("day", d, to),
			),
		[to, intervals],
	);
	const [values, setValues] = useState<ReadonlyArray<number>>([
		indexOfFrom,
		indexOfTo,
	]);
	const [tempValues, setTempValues] = useState<
		ReadonlyArray<number> | undefined
	>([indexOfFrom, indexOfTo]);
	const [isDragging, setIsDragging] = useState(false);
	const [setDebouncedIsDragging] = useDebounce(setIsDragging, 500, {
		leading: false,
		trailing: true,
	});
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const startDragging = useCallback(() => {
		setIsDragging(true);
		setDebouncedIsDragging(false);
	}, []);

	useEffect(() => {
		setValues([indexOfFrom, indexOfTo]);
		setTempValues([indexOfFrom, indexOfTo]);
	}, [indexOfFrom, indexOfTo]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const onValuesChange = useCallback((vals: [number, number]) => {
		const [from, to] = [
			intervals[vals[0]] ?? intervals[0],
			intervals[vals[1]] ?? intervals[intervals.length - 1],
		]
			.map((d) => new Date(d.time))
			.sort(compareAsc);

		setTempValues(vals);
		setDateRange({ from, to });
	}, []);

	const onChange = useCallback(
		(instance: Ranger<HTMLDivElement>) => {
			const [fromIdx, toIdx] = instance.sortedValues;
			onValuesChange([
				Math.max(0, fromIdx),
				Math.min(intervals.length - 1, toIdx),
			]);
		},
		[onValuesChange, intervals],
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const onDrag = useCallback((instance: Ranger<HTMLDivElement>) => {
		const [fromIdx, toIdx] = instance.sortedValues;
		setTempValues([fromIdx, toIdx]);
		startDragging();
	}, []);

	const rangerInstance = useRanger<HTMLDivElement>({
		getRangerElement: () => rangerRef.current,
		values: tempValues || values,
		min: 0,
		max: intervals.length - 1,
		stepSize: 1,
		steps: rangerSteps,
		ticks: rangerTicks,
		onChange,
		onDrag,
	});

	const handleSegmentDrag = useCallback(
		(
			e: MouseEvent | TouchEvent,
			initialX: number,
			values: ReadonlyArray<number>,
		) => {
			let clientX = e instanceof MouseEvent ? e.clientX : 0;
			if (window.TouchEvent && e instanceof window.TouchEvent) {
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
					return values.map((v) => v + actualDiff).sort();
				}
			}
			return values;
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
				startDragging();
			};
			const handleRelease = (e: MouseEvent | TouchEvent) => {
				const [fromIdx, toIdx] = [...(tempVals || values)].sort();
				onValuesChange([fromIdx, toIdx]);
				onDrag(e);
				document.removeEventListener("mousemove", onDrag);
				document.removeEventListener("touchmove", onDrag);
				document.removeEventListener("mouseup", handleRelease);
				document.removeEventListener("touchend", handleRelease);
				setIsDragging(false);
			};

			document.addEventListener("mousemove", onDrag);
			document.addEventListener("touchmove", onDrag);
			document.addEventListener("mouseup", handleRelease);
			document.addEventListener("touchend", handleRelease);
		},
		[handleSegmentDrag, onValuesChange, values, startDragging],
	);

	const handles = rangerInstance.handles()
	const steps = rangerInstance.getSteps();
	return (
		<div
			className={cn(
				`w-full h-7 border border-grayLight`,
				`rounded-md relative`,
			)}
		>
			<BackgroundVis />
			<div
				ref={rangerRef}
				className={cn(
					"draggable-time-filter-range",
					"relative select-none h-full",
				)}
			>
				{steps.slice(0, 3).map(({ left, width }, i) => (
					<button
						type="button"
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						key={`segment-${i}`}
						ref={i === 1 ? midSegmentRef : null}
						className={cn(
							`draggable-time-filter-range-segment`,
							`absolute h-full w-full left-0 top-0`,
							i === 1 &&
							`ring-[1px] ring-grayMed focusable focus-visible:rounded-sm`,
							i !== 1 &&
							`bg-grayUltraLight mix-blend-multiply dark:mix-blend-screen`,
						)}
						tabIndex={i === 1 ? 0 : -1}
						onMouseDown={(e) => handleSegmentPress(e)}
						onTouchStart={(e) => handleSegmentPress(e)}
						style={{ left: `${left}%`, width: `${width}%` }}
					/>
				))}
				{handles.slice(0, 2).map((props, i) => {
					const val = intervals[Math.max(0, Math.min(intervals.length - 1, props.value))];
					if (!val) return null;
					return (
						<Handle
							{...props}
							key={`handle-${val.time}-${val.year}-${val.month}-${val.day}-${i}`}
							comparableDateObject={val}
							rangerInstance={rangerInstance}
							isDragging={isDragging}
							isStart={i === 0}
						/>
					);
				})}
			</div>
		</div>
	);
}

const Handle = memo(
	({
		value,
		comparableDateObject,
		onKeyDownHandler,
		onMouseDownHandler,
		onTouchStart,
		isActive,
		rangerInstance,
		isDragging = false,
		isStart = true,
	}: {
		value: number;
		comparableDateObject: ComparableDateItemType;
		onKeyDownHandler: (e: ReactKeyboardEvent) => void;
		onMouseDownHandler: (e: ReactMouseEvent) => void;
		onTouchStart: (e: ReactTouchEvent) => void;
		isActive: boolean;
		rangerInstance: Ranger<HTMLDivElement>;
		isDragging?: boolean;
		isStart?: boolean;
	}) => {
		const { date } = comparableDateObject;
		const formattedDate = useMemo(() => format(date, "dd. MMM. yyyy"), [date]);

		const handleKeyDown = useCallback(
			(e: ReactKeyboardEvent) => {
				if (e.key === "Tab") return;
				e.preventDefault();
				onKeyDownHandler(e);
			},
			[onKeyDownHandler],
		);

		const handleMouseDown = useCallback(
			(e: ReactMouseEvent) => {
				e.preventDefault();
				onMouseDownHandler(e);
			},
			[onMouseDownHandler],
		);

		const handleTouchStart = useCallback(
			(e: ReactTouchEvent) => {
				e.preventDefault();
				onTouchStart(e);
			},
			[onTouchStart],
		);

		const left = useMemo(
			() => `${rangerInstance.getPercentageForValue(value)}%`,
			[rangerInstance, value],
		);
		if (!comparableDateObject) return null;
		return (
			<button
				type="button"
				onKeyDown={handleKeyDown}
				onMouseDown={handleMouseDown}
				onTouchStart={handleTouchStart}
				role="slider"
				aria-valuemin={rangerInstance.options.min}
				aria-valuemax={rangerInstance.options.max}
				aria-valuenow={value}
				className={cn(
					`w-4 h-[calc(100%+0.5rem+1px)] p-1`,
					`absolute top-1/2 -translate-x-1/2 -translate-y-1/2`,
					`focusable transition all rounded-full focus-visible:bg-bg`,
					`cursor-ew-resize group`,
				)}
				style={{ left, zIndex: isActive ? "1" : "0" }}
			>
				<HandleTooptip
					formattedDate={formattedDate}
					isStart={isStart}
					isDragging={isDragging}
				/>
			</button>
		);
	},
);

const HandleTooptip = memo(
	({
		formattedDate,
		isStart,
		isDragging,
	}: { formattedDate: string; isStart: boolean; isDragging: boolean }) => (
		<span
			className={cn(
				`size-full relative bg-fg rounded-full transition hover:bg-grayDark`,
				`inline-block`,
			)}
		>
			<span
				className={cn(
					`absolute`,
					`bg-fg text-bg opacity-0 px-1 py-0.25 text-sm`,
					`group-hover:opacity-100  pointer-events-none`,
					`[.draggable-time-filter-range:has(.draggable-time-filter-range-segment:hover)_&]:opacity-100`,
					`transition whitespace-nowrap text-center`,
					`grid grid-cols-[22px_35px_35px]`,
					isStart && `left-0 bottom-full group-hover:-translate-y-1`,
					!isStart && `right-0 top-full group-hover:translate-y-1`,
					isDragging && `opacity-100`,
					isDragging && isStart && `-translate-y-1`,
					isStart &&
					`[.draggable-time-filter-range:has(.draggable-time-filter-range-segment:hover)_&]:-translate-y-1`,
					isDragging && !isStart && `translate-y-1`,
					!isStart &&
					`[.draggable-time-filter-range:has(.draggable-time-filter-range-segment:hover)_&]:translate-y-1`,
				)}
			>
				{formattedDate.split(" ").map((part, i) => (
					<span key={part}>{part}</span>
				))}
			</span>
		</span>
	),
);

const BackgroundVis = memo(() => {
	const [parentRef, size] = useElementSize();
	const { datasetStartDate, datasetEndDate } = useToday();
	const { data } = useEvents({
		from: datasetStartDate,
		to: datasetEndDate,
	});
	const { eventColumns, columnsCount, sizeScale } = useTimelineEvents({
		size,
		data,
		aggregationUnit: "week",
		config: {
			eventMinHeight: 2,
			eventMaxHeight: Math.floor(size.height * 0.9),
			aggregatedEventMaxHeight: Math.floor(size.height * 0.9),
		},
		from: datasetStartDate,
		to: datasetEndDate,
	});
	return (
		<span
			ref={parentRef}
			className={cn(
				`absolute top-0 left-0 h-full w-full pointer-events-none`,
				`z-0 grid gap-px rounded-md overflow-clip`,
			)}
			style={{ gridTemplateColumns: `repeat(${columnsCount}, 1fr)` }}
		>
			{eventColumns.map(({ time, sumSize }) => (
				<span key={time} className="size-full flex flex-col gap-px justify-end">
					<span
						className="w-full h-0.5 bg-grayLight"
						style={{ height: sizeScale(sumSize) }}
					/>
				</span>
			))}
		</span>
	);
});

export default DraggableTimeFilterRange;
