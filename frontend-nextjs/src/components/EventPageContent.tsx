"use client";
import { cn } from "@/utility/classNames";
import { parseErrorMessage } from "@/utility/errorHandlingUtil";
import type { EventType, OrganisationType } from "@/utility/eventsUtil";
import useEvent from "@/utility/useEvent";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { format } from "date-fns";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense, memo, useMemo } from "react";
import placeholderImage from "../assets/images/placeholder-image.avif";
import ComponentError from "./ComponentError";

const EventPageContent = memo(
	({
		event,
		organisations,
	}: { event?: EventType; organisations?: OrganisationType[] }) => {
		if (!event || !organisations) return notFound();
		const title = useMemo(
			() =>
				`Protest on ${format(event.date, "LLLL d, yyyy")} by ${
					organisations.length > 1
						? "multiple organisations"
						: organisations[0].name
				}`,
			[event, organisations],
		);
		return (
			<div className="grid md:grid-cols-[3fr,1fr] lg:grid-cols-[2fr,1fr]">
				<div className="px-[max(1rem,2vmax)] pt-[max(1.25rem,2.5vmax)] pb-[max(1.25rem,4vmax)] flex flex-col gap-4 min-h-full">
					<h1 className="text-3xl font-bold font-headlines">{title}</h1>
					<dl className="inline-grid grid-cols-[auto,1fr] gap-x-6 gap-y-2 items-start">
						<dt className="w-fit">City</dt>
						<dd>{event.city}</dd>
						<dt className="w-fit">Country</dt>
						<dd>{event.country}</dd>
						<dt className="w-fit">Organisations</dt>
						<dd className="flex flex-wrap">
							{organisations.map((org) => (
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
						</dd>
					</dl>
					<p className="max-w-prose">{event.description}</p>
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

export default function EventPageContentWithData({
	id,
}: { id: EventType["event_id"] }) {
	const query = useEvent(id);

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
						<Suspense fallback={<div>Loading...</div>}>
							<EventPageContent
								event={query.data?.event}
								organisations={query.data?.organisations}
							/>
						</Suspense>
					</ErrorBoundary>
				)}
			</QueryErrorResetBoundary>
		</div>
	);
}
