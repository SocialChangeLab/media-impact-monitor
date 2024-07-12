"use client";
import { cn } from "@/utility/classNames";
import { parseErrorMessage } from "@/utility/errorHandlingUtil";
import type {
	EventOrganizerSlugType,
	OrganisationType,
} from "@/utility/eventsUtil";
import useEvents from "@/utility/useEvents";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import Image from "next/image";
import { Suspense, memo, useMemo } from "react";
import seed from "seed-random";
import placeholderImage from "../assets/images/placeholder-image.avif";
import ComponentError from "./ComponentError";

const seededRandom = seed("event-page-loading");

const PlaceholderSkeleton = memo(
	({ width, height }: { width: number | string; height?: number | string }) => (
		<span
			className="h-8 w-32 bg-grayMed rounded animate-pulse inline-block"
			style={{ width, height }}
		/>
	),
);

const OrganisationPageWithPopulatedData = memo(
	({ org }: { org?: OrganisationType }) => {
		const title = useMemo(
			() => (
				<>
					<span
						className={cn(
							"w-5 h-5 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]",
							!org && "animate-pulse bg-grayMed",
						)}
						style={{ backgroundColor: org?.color }}
						aria-hidden="true"
					/>
					{org ? (
						<span>{org.name}</span>
					) : (
						<PlaceholderSkeleton width={180} height={30} />
					)}
				</>
			),
			[org],
		);
		return (
			<div className="grid md:grid-cols-[3fr,1fr] lg:grid-cols-[2fr,1fr] border-b border-grayLight -mt-6 min-h-56">
				<div className="px-[max(1rem,2vmax)] pt-[max(1.25rem,2.5vmax)] pb-[max(1.25rem,4vmax)] flex flex-col gap-4 min-h-full">
					<h1 className="text-3xl font-bold font-headlines flex gap-3 items-center">
						{title}
					</h1>
				</div>
				<div className="relative border-l border-grayLight bg-grayUltraLight">
					<Image
						src={placeholderImage}
						alt={`Image for ${title}`}
						className="object-cover object-center"
						fill
					/>
					<div
						aria-hidden="true"
						className="absolute inset-0 mix-blend-soft-light"
						style={{ backgroundColor: org?.color }}
					/>
				</div>
			</div>
		);
	},
);

const OrganisationPageHeader = memo(
	({ slug }: { slug: EventOrganizerSlugType }) => {
		const { data } = useEvents();
		const org = data?.organisations.find((x) => x.slug === slug);
		return <OrganisationPageWithPopulatedData org={org} />;
	},
);

export default function OrganisationPageHeaderWithData({
	slug,
}: { slug: EventOrganizerSlugType }) {
	return (
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
					<Suspense fallback={<OrganisationPageWithPopulatedData />}>
						<OrganisationPageHeader slug={slug} />
					</Suspense>
				</ErrorBoundary>
			)}
		</QueryErrorResetBoundary>
	);
}
