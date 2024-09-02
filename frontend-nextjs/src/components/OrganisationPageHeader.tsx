'use client'
import { cn } from '@/utility/classNames'
import { parseErrorMessage } from '@/utility/errorHandlingUtil'
import type { EventOrganizerSlugType } from '@/utility/eventsUtil'
import { getOrgStats } from '@/utility/orgsUtil'
import { texts } from '@/utility/textUtil'
import { useTimeFilteredEvents } from '@/utility/useEvents'
import {
	useAllOrganisations,
	useOrganisation,
} from '@/utility/useOrganisations'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { ErrorBoundary } from 'next/dist/client/components/error-boundary'
import Image from 'next/image'
import { Suspense, memo, useMemo } from 'react'
import placeholderImage from '../assets/images/placeholder-image.avif'
import ComponentError from './ComponentError'
import InternalLink from './InternalLink'
import OrgsTooltip from './OrgsTooltip'

const PlaceholderSkeleton = memo(
	({ width, height }: { width: number | string; height?: number | string }) => (
		<span
			className="h-8 w-32 bg-grayMed rounded animate-pulse inline-block"
			style={{ width, height }}
		/>
	),
)

function formatNumber(num: number) {
	if (Number.isNaN(num)) return '?'
	return Number.parseFloat(num.toFixed(2)).toLocaleString(texts.language)
}

const OrganisationPageHeader = memo(
	({ slug }: { slug?: EventOrganizerSlugType }) => {
		const { organisation } = useOrganisation(slug)
		const { organisations } = useAllOrganisations()
		const { timeFilteredEvents } = useTimeFilteredEvents()
		const title = useMemo(
			() => (
				<>
					<span
						className={cn(
							'w-5 h-5 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]',
							!organisation && 'animate-pulse bg-grayMed',
						)}
						style={{ backgroundColor: organisation?.color }}
						aria-hidden="true"
					/>
					{organisation ? (
						<span>{organisation.name}</span>
					) : (
						<PlaceholderSkeleton width={180} height={36} />
					)}
				</>
			),
			[organisation],
		)

		const stats = useMemo(() => {
			if (!organisation) return
			return getOrgStats({
				events: timeFilteredEvents,
				organisations: organisations,
				organisation: organisation,
			})
		}, [timeFilteredEvents, organisation, organisations])

		return (
			<div className="grid md:grid-cols-[3fr,1fr] lg:grid-cols-[2fr,1fr] border-b border-grayLight min-h-56">
				<div className="px-[var(--pagePadding)] pt-[max(1.25rem,2.5vmax)] pb-[max(1.25rem,4vmax)] flex flex-col gap-4 min-h-full">
					<InternalLink
						href={`/organisations`}
						className="flex gap-2 items-center text-grayDark hover:text-fg hover:font-semibold transition-all"
					>
						<ArrowLeft size={16} className="text-grayDark" />
						<span>{texts.organisationsPage.allOrganisations}</span>
					</InternalLink>
					<h1 className="text-3xl font-bold font-headlines flex gap-3 items-center">
						{title}
					</h1>
					<dl className="inline-grid grid-cols-[auto,1fr] gap-x-6 gap-y-2 items-center">
						<dt>{texts.organisationsPage.propertyNames.totalEvents}</dt>
						<dd>
							{stats ? (
								formatNumber(stats.totalEvents)
							) : (
								<PlaceholderSkeleton height="1rem" width={30} />
							)}
						</dd>
						<dt>{texts.organisationsPage.propertyNames.totalParticipants}</dt>
						<dd>
							{stats ? (
								formatNumber(stats.totalParticipants)
							) : (
								<PlaceholderSkeleton height="1rem" width={60} />
							)}
						</dd>
						<dt>{texts.organisationsPage.propertyNames.avgParticipants}</dt>
						<dd>
							{stats ? (
								formatNumber(stats.avgParticipantsPerEvent)
							) : (
								<PlaceholderSkeleton height="1rem" width={50} />
							)}
						</dd>
						<dt>{texts.organisationsPage.propertyNames.totalPartners}</dt>
						<dd>
							{stats ? (
								<OrgsTooltip otherOrgs={stats.partners} withPills>
									<button
										type="button"
										className="underline underline-offset-4 decoration-grayMed cursor-pointer focusable"
										aria-label={texts.organisationsPage.showPartnersAriaLabel}
									>
										{formatNumber(stats.totalPartners)}
									</button>
								</OrgsTooltip>
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
						style={{ backgroundColor: organisation?.color }}
					/>
				</div>
			</div>
		)
	},
)

export default function OrganisationPageHeaderWithData({
	slug,
}: {
	slug: EventOrganizerSlugType
}) {
	return (
		<QueryErrorResetBoundary>
			{({ reset }) => (
				<ErrorBoundary
					errorComponent={({ error }) => {
						const { message, details } = parseErrorMessage(error)
						return (
							<ComponentError
								errorMessage={message}
								errorDetails={details}
								reset={reset}
							/>
						)
					}}
				>
					<Suspense fallback={<OrganisationPageHeader slug={slug} />}>
						<OrganisationPageHeader slug={slug} />
					</Suspense>
				</ErrorBoundary>
			)}
		</QueryErrorResetBoundary>
	)
}
