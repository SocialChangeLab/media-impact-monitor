'use client'
import { cn } from '@/utility/classNames'
import { format } from '@/utility/dateUtil'
import { parseErrorMessage } from '@/utility/errorHandlingUtil'
import type { ParsedEventType } from '@/utility/eventsUtil'
import { arrayOfRandomLengthInRange, randomInRange } from '@/utility/randomUtil'
import { texts } from '@/utility/textUtil'
import useEvent from '@/utility/useEvent'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from 'next/dist/client/components/error-boundary'
import Image from 'next/image'
import { Suspense, memo, useMemo } from 'react'
import seed from 'seed-random'
import placeholderImage from '../assets/images/placeholder-image.avif'
import ComponentError from './ComponentError'

const seededRandom = seed('event-page-loading')
const randomUntil = (max: number) => Math.ceil(seededRandom() * max)

const PlaceholderSkeleton = memo(
	({ width, height }: { width: number | string; height?: number | string }) => (
		<span
			className="h-4 w-32 bg-grayMed rounded animate-pulse inline-block"
			style={{ width, height }}
		/>
	),
)

const EventPageWithPopulatedData = memo(
	({ data }: { data?: ReturnType<typeof useEvent>['data'] }) => {
		const orgsPlaceholders = useMemo(
			() =>
				arrayOfRandomLengthInRange(3).map((idx, _i, arr) => (
					<PlaceholderSkeleton key={idx} width={randomUntil(200)} />
				)),
			[],
		)
		const descPlaceholderLines = useMemo(
			() => (
				<span className="flex flex-col gap-y-1">
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
				</span>
			),
			[],
		)
		const title = useMemo(() => {
			if (!data) return <PlaceholderSkeleton width={80} height={20} />
			return texts.singleProtestPage.heading({
				formattedDate: format(data.event.date, 'LLLL d, yyyy'),
				orgsCount: data.organisations.length,
				orgName: data.organisations[0]?.name,
			})
		}, [data])

		const hasOrganisations = useMemo(
			() =>
				Boolean(data?.organisations?.length && data?.organisations.length > 0),
			[data],
		)
		return (
			<div className="grid md:grid-cols-[3fr,1fr] lg:grid-cols-[2fr,1fr] border-b border-grayLight">
				<div className="px-content pt-[max(1.25rem,2.5vmax)] pb-[max(1.25rem,4vmax)] flex flex-col gap-4 min-h-full">
					<h1 className="text-3xl font-bold font-headlines">{title}</h1>
					<dl className="inline-grid grid-cols-[auto,1fr] gap-x-6 gap-y-2 items-center">
						<dt className="w-fit">
							{texts.singleProtestPage.propertyNames.city}
						</dt>
						<dd>{data?.event.city ?? <PlaceholderSkeleton width={100} />}</dd>
						<dt className="w-fit">
							{texts.singleProtestPage.propertyNames.country}
						</dt>
						<dd>{data?.event.country ?? <PlaceholderSkeleton width={80} />}</dd>
						{hasOrganisations && (
							<>
								<dt className="w-fit self-start">
									{texts.singleProtestPage.propertyNames.organisations}
								</dt>
								<dd className="flex flex-wrap">
									{data?.organisations.map((org) => (
										<span
											key={org.slug}
											className={cn(
												'grid grid-cols-[auto_1fr_auto] gap-x-2',
												`items-center cursor-pointer`,
											)}
										>
											<span
												className={cn(
													'size-4 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)] bg-grayDark',
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
							</>
						)}
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
		)
	},
)

const EventPageContent = memo(({ id }: { id: ParsedEventType['event_id'] }) => {
	const { data } = useEvent(id)
	return <EventPageWithPopulatedData data={data} />
})

export default function EventPageContentWithData({
	id,
}: {
	id: ParsedEventType['event_id']
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
					<Suspense fallback={<EventPageWithPopulatedData />}>
						<EventPageContent id={id} />
					</Suspense>
				</ErrorBoundary>
			)}
		</QueryErrorResetBoundary>
	)
}
