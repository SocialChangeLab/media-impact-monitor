"use client";
import { cn } from "@/utility/classNames";
import { parseErrorMessage } from "@/utility/errorHandlingUtil";
import type { EventType } from "@/utility/eventsUtil";
import {
	arrayOfRandomLengthInRange,
	randomInRange,
} from "@/utility/randomUtil";
import useEvent from "@/utility/useEvent";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { format } from "date-fns";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import Image from "next/image";
import { Suspense, memo, useMemo } from "react";
import seed from "seed-random";
import placeholderImage from "../assets/images/placeholder-image.avif";
import ComponentError from "./ComponentError";

const seededRandom = seed("event-page-loading");
const randomUntil = (max: number) => Math.ceil(seededRandom() * max);

const PlaceholderSkeleton = memo(
	({ width, height }: { width: number | string; height?: number | string }) => (
		<span
			className="h-4 w-32 bg-grayMed rounded animate-pulse inline-block"
			style={{ width, height }}
		/>
	),
);

const EventPageWithPopulatedData = memo(
	({ data }: { data?: ReturnType<typeof useEvent>["data"] }) => {
		const orgsPlaceholders = useMemo(
			() =>
				arrayOfRandomLengthInRange(3).map((idx, _i, arr) => (
					<PlaceholderSkeleton key={idx} width={randomUntil(200)} />
				)),
			[],
		);
		const descPlaceholderLines = useMemo(
			() => (
				<div className="flex flex-col gap-y-1">
					{arrayOfRandomLengthInRange(10, 5).map((idx, _i, arr) => (
						<PlaceholderSkeleton
							key={idx}
							width={
								idx === arr.length - 1
									? `${randomInRange(50, 20)}%`
									: `${randomInRange(100, 80)}%`
							}
						/>
					))}
				</div>
			),
			[],
		);
		const title = useMemo(
			() =>
				data ? (
					`Protest on ${format(data.event.date, "LLLL d, yyyy")} by ${
						data.organisations.length > 1
							? "multiple organisations"
							: data.organisations[0].name
					}`
				) : (
					<PlaceholderSkeleton width={80} height={20} />
				),
			[data],
		);
		return (
			<div className="grid md:grid-cols-[3fr,1fr] lg:grid-cols-[2fr,1fr] border-b border-grayLight -mt-6">
				<div className="px-[max(1rem,2vmax)] pt-[max(1.25rem,2.5vmax)] pb-[max(1.25rem,4vmax)] flex flex-col gap-4 min-h-full">
					<h1 className="text-3xl font-bold font-headlines">{title}</h1>
					<dl className="inline-grid grid-cols-[auto,1fr] gap-x-6 gap-y-2 items-center">
						<dt className="w-fit">City</dt>
						<dd>{data?.event.city ?? <PlaceholderSkeleton width={100} />}</dd>
						<dt className="w-fit">Country</dt>
						<dd>{data?.event.country ?? <PlaceholderSkeleton width={80} />}</dd>
						<dt className="w-fit self-start">Organisations</dt>
						<dd className="flex flex-wrap">
							{data?.organisations.map((org) => (
								<span
									key={org.name}
									className={cn(
										"grid grid-cols-[auto_1fr_auto] gap-x-2",
										`items-center cursor-pointer`,
									)}
								>
									<span
										className={cn(
											"size-4 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)] bg-grayDark",
										)}
										style={{ backgroundColor: org.color }}
										aria-hidden="true"
									/>
									<span className="grid grid-cols-[1fr_auto] gap-4">
										{org.name}
									</span>
								</span>
							))}
							{!data && orgsPlaceholders}
						</dd>
					</dl>
					<p className="max-w-prose">
						{data?.event.description ?? descPlaceholderLines}
					</p>
				</div>
				<div className="relative border-l border-grayLight bg-grayUltraLight">
					<Image
						src={placeholderImage}
						alt={`Image for ${title}`}
						className="object-cover object-center"
						fill
					/>
				</div>
			</div>
		);
	},
);

const EventPageContent = memo(({ id }: { id: EventType["event_id"] }) => {
	const { data } = useEvent(id);
	return <EventPageWithPopulatedData data={data} />;
});

export default function EventPageContentWithData({
	id,
}: { id: EventType["event_id"] }) {
	return (
		<div className="min-h-screen">
			<QueryErrorResetBoundary>
				{({ reset }) => (
					<ErrorBoundary
						errorComponent={({ error }) => {
							const { message, details } = parseErrorMessage(error);
							return (
								<ComponentError
									errorMessage={message}
									errorDetails={details}
									reset={reset}
								/>
							);
						}}
					>
						<Suspense fallback={<EventPageWithPopulatedData />}>
							<EventPageContent id={id} />
						</Suspense>
					</ErrorBoundary>
				)}
			</QueryErrorResetBoundary>
		</div>
	);
}
