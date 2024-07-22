"use client";
import { cn } from "@/utility/classNames";
import { parseErrorMessage } from "@/utility/errorHandlingUtil";
import type { EventOrganizerSlugType } from "@/utility/eventsUtil";
import useMediaSentimentImpactData from "@/utility/useMediaSentimentImpact";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import type { icons } from "lucide-react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import ComponentError from "../ComponentError";
import ImpactChart from "./ImpactChart";

type ImpactChartWithDataProps = {
	reset?: () => void;
	unitLabel?: string;
	icon?: keyof typeof icons;
};

type ImpactChartErrorProps = Pick<ImpactChartWithDataProps, "reset"> &
	ReturnType<typeof parseErrorMessage>;

function ImpactChartError(props: ImpactChartErrorProps) {
	return (
		<div
			className={cn(
				"w-full min-h-96 p-8 border border-grayLight",
				"flex items-center justify-center bg-grayUltraLight",
			)}
		>
			<ComponentError
				errorMessage={props.message}
				errorDetails={props.details}
				reset={props.reset}
			/>
		</div>
	);
}

function ImpactChartLoading() {
	return (
		<div
			className={cn(
				"w-full min-h-96 p-8 border border-grayLight",
				"flex items-center justify-center bg-grayUltraLight",
			)}
		>
			<span>Loading data...</span>
		</div>
	);
}

function ImpactChartEmpty() {
	return (
		<div
			className={cn(
				"w-full min-h-96 p-8 border border-grayLight",
				"flex items-center justify-center bg-grayUltraLight",
			)}
		>
			<span>No data for the current configuration</span>
		</div>
	);
}

function ImpactChartWithData({
	reset,
	unitLabel = "articles & media",
	icon = "LineChart",
}: ImpactChartWithDataProps) {
	const fffQuery = useMediaSentimentImpactData(
		"fridays-for-future" as EventOrganizerSlugType,
	);
	const xrQuery = useMediaSentimentImpactData(
		"extinction-rebellion" as EventOrganizerSlugType,
	);
	const data = {
		fridaysForFuture: fffQuery.data,
		extinctionRebellion: xrQuery.data,
	};
	const isEmpty = Object.entries(data).every(
		([_key, data]) => data?.data && data.data.length === 0,
	);
	const isError = fffQuery.isError || xrQuery.isError;
	const isSuccess = fffQuery.isSuccess && xrQuery.isSuccess;
	const isPending = fffQuery.isPending || xrQuery.isPending;
	const error = fffQuery.error || xrQuery.error;
	if (isError)
		return <ImpactChartError reset={reset} {...parseErrorMessage(error)} />;
	if (isPending) return <ImpactChartLoading />;
	if (isSuccess && isEmpty) return <ImpactChartEmpty />;
	return (
		<ImpactChart
			columns={Object.entries(data).map(([key, data]) => ({
				id: key,
				data: data?.data || [],
			}))}
			unitLabel={unitLabel}
			icon={icon}
		/>
	);
}

export default function ImpactChartWithErrorBoundary() {
	return (
		<QueryErrorResetBoundary>
			{({ reset }) => (
				<ErrorBoundary
					errorComponent={({ error }) => (
						<ImpactChartError reset={reset} {...parseErrorMessage(error)} />
					)}
				>
					<Suspense fallback={<ImpactChartLoading />}>
						<ImpactChartWithData reset={reset} />
					</Suspense>
				</ErrorBoundary>
			)}
		</QueryErrorResetBoundary>
	);
}
