"use client";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { cn } from "@/utility/classNames";
import { parseErrorMessage } from "@/utility/errorHandlingUtil";
import type { EventOrganizerSlugType } from "@/utility/eventsUtil";
import useEvents from "@/utility/useEvents";
import useMediaImpactData from "@/utility/useMediaImpact";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import type { icons } from "lucide-react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense, useEffect, useMemo, useState } from "react";
import ChartLoadingPlaceholder from "../ChartLoadingPlaceholder";
import ComponentError from "../ComponentError";
import ImpactChart from "./ImpactChart";

type ImpactChartWithDataProps = {
	type: "keywords" | "sentiment";
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
	return <ChartLoadingPlaceholder />;
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
	type = "keywords",
}: ImpactChartWithDataProps) {
	const {
		data: { organisations },
	} = useEvents();
	const selectedOrgs = useFiltersStore((state) => state.organizers.sort());
	const orgs = useMemo(
		() =>
			selectedOrgs.length === 0
				? organisations.map(({ slug }) => slug)
				: selectedOrgs,
		[selectedOrgs, organisations],
	);

	const [org1, setOrg1] = useState<EventOrganizerSlugType | undefined>(orgs[0]);
	const [org2, setOrg2] = useState<EventOrganizerSlugType | undefined>(orgs[1]);
	const [org3, setOrg3] = useState<EventOrganizerSlugType | undefined>(orgs[2]);

	useEffect(() => {
		setOrg1(orgs[0]);
		setOrg2(orgs[1]);
		setOrg3(orgs[2]);
	}, [orgs]);

	const orgChangeHandlers = [setOrg1, setOrg2, setOrg3];

	const org1Query = useMediaImpactData(org1, type);
	const org2Query = useMediaImpactData(org2, type);
	const org3Query = useMediaImpactData(org3, type);

	const queries = {} as Record<string, ReturnType<typeof useMediaImpactData>>;
	if (org1) queries[org1] = org1Query;
	if (org2) queries[org2] = org1Query;
	if (org3) queries[org3] = org1Query;

	const queriesArray = Object.values(queries);
	const data = {} as Record<
		string,
		ReturnType<typeof useMediaImpactData>["data"]
	>;
	if (org1) data[org1] = org1Query.data;
	if (org2) data[org2] = org2Query.data;
	if (org3) data[org3] = org3Query.data;

	const isEmpty = queriesArray.every(
		(query) => query?.data?.data && query.data.data.length === 0,
	);
	const isError = queriesArray.some((query) => query.isError);
	const isSuccess = queriesArray.every((query) => query.isSuccess);
	const isPending = queriesArray.some((query) => query.isPending);
	const error = queriesArray.find((query) => query.error)?.error;
	if (isError)
		return <ImpactChartError reset={reset} {...parseErrorMessage(error)} />;
	if (isPending) return <ImpactChartLoading />;
	if (isSuccess && isEmpty) return <ImpactChartEmpty />;

	return (
		<ImpactChart
			columns={Object.entries(data).map(([key, d], idx) => ({
				id: key,
				data: d?.data || null,
				limitations: d?.limitations,
				error: queries[key as keyof typeof queries]?.error ?? null,
				onOrgChange: orgChangeHandlers[idx],
			}))}
			unitLabel={unitLabel}
			icon={icon}
		/>
	);
}

export default function ImpactChartWithErrorBoundary({
	type = "keywords",
}: {
	type?: "keywords" | "sentiment";
}) {
	return (
		<QueryErrorResetBoundary>
			{({ reset }) => (
				<ErrorBoundary
					errorComponent={({ error }) => (
						<ImpactChartError reset={reset} {...parseErrorMessage(error)} />
					)}
				>
					<Suspense fallback={<ImpactChartLoading />}>
						<ImpactChartWithData reset={reset} type={type} />
					</Suspense>
				</ErrorBoundary>
			)}
		</QueryErrorResetBoundary>
	);
}
