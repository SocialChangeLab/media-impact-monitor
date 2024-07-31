"use client";
import { cn } from "@/utility/classNames";
import { parseErrorMessage } from "@/utility/errorHandlingUtil";
import type { EventOrganizerSlugType } from "@/utility/eventsUtil";
import { getOrgStats } from "@/utility/orgsUtil";
import useEvents from "@/utility/useEvents";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import Image from "next/image";
import { Suspense, memo, useMemo } from "react";
import placeholderImage from "../assets/images/placeholder-image.avif";
import ComponentError from "./ComponentError";
import InternalLink from "./InternalLink";

const PlaceholderSkeleton = memo(
	({ width, height }: { width: number | string; height?: number | string }) => (
		<span
			className="h-8 w-32 bg-grayMed rounded animate-pulse inline-block"
			style={{ width, height }}
		/>
	),
);

const OrganisationPageWithPopulatedData = memo(
	({
		slug,
		data,
	}: {
		data?: ReturnType<typeof useEvents>["data"];
		slug: EventOrganizerSlugType;
	}) => {
		const org = data?.organisations.find((x) => x.slug === slug);
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
						<PlaceholderSkeleton width={180} height={36} />
					)}
				</>
			),
			[org],
		);

		const stats = useMemo(() => {
			if (!data || !org) return;
			return getOrgStats({
				events: data.events,
				organisations: data.organisations,
				organisation: org,
			});
		}, [data, org]);
		return (
			<div className="grid md:grid-cols-[3fr,1fr] lg:grid-cols-[2fr,1fr] border-b border-grayLight min-h-56">
				<div className="px-[max(1rem,2vmax)] pt-[max(1.25rem,2.5vmax)] pb-[max(1.25rem,4vmax)] flex flex-col gap-4 min-h-full">
					<InternalLink
						href={`/organisations`}
						className="flex gap-2 items-center text-grayDark hover:text-fg hover:font-semibold transition-all"
					>
						<ArrowLeft size={16} className="text-grayDark" />
						<span>All organisations</span>
					</InternalLink>
					<h1 className="text-3xl font-bold font-headlines flex gap-3 items-center">
						{title}
					</h1>
					<dl className="inline-grid grid-cols-[auto,1fr] gap-x-6 gap-y-2 items-center">
						<dt>Total Events</dt>
						<dd>
							{stats ? (
								Math.round(stats.totalEvents).toLocaleString("en-GB")
							) : (
								<PlaceholderSkeleton height="1rem" width={30} />
							)}
						</dd>
						<dt>Total Participants</dt>
						<dd>
							{stats ? (
								Math.round(stats.totalParticipants).toLocaleString("en-GB")
							) : (
								<PlaceholderSkeleton height="1rem" width={60} />
							)}
						</dd>
						<dt>Avg. Participants</dt>
						<dd>
							{stats ? (
								Math.round(stats.avgParticipantsPerEvent).toLocaleString(
									"en-GB",
								)
							) : (
								<PlaceholderSkeleton height="1rem" width={50} />
							)}
						</dd>
						<dt>Avg. Partners</dt>
						<dd>
							{stats ? (
								Math.round(stats.avgPartnerOrgsPerEvent).toLocaleString("en-GB")
							) : (
								<PlaceholderSkeleton height="1rem" width={20} />
							)}
						</dd>
						<dt>Total Partners</dt>
						<dd>
							{stats ? (
								Math.round(stats.totalPartners).toLocaleString("en-GB")
							) : (
								<PlaceholderSkeleton height="1rem" width={30} />
							)}
						</dd>
					</dl>
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
		return <OrganisationPageWithPopulatedData data={data} slug={slug} />;
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
					<Suspense
						fallback={<OrganisationPageWithPopulatedData slug={slug} />}
					>
						<OrganisationPageHeader slug={slug} />
					</Suspense>
				</ErrorBoundary>
			)}
		</QueryErrorResetBoundary>
	);
}
