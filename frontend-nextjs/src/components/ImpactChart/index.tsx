'use client'
import { useFiltersStore } from '@/providers/FiltersStoreProvider'
import { cn } from '@/utility/classNames'
import { parseErrorMessage } from '@/utility/errorHandlingUtil'
import type { EventOrganizerSlugType } from '@/utility/eventsUtil'
import type { TrendQueryProps } from '@/utility/mediaTrendUtil'
import useMediaImpactData from '@/utility/useMediaImpact'
import { useAllOrganisations } from '@/utility/useOrganisations'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import type { icons } from 'lucide-react'
import { ErrorBoundary } from 'next/dist/client/components/error-boundary'
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import ChartLoadingPlaceholder from '../ChartLoadingPlaceholder'
import ComponentError from '../ComponentError'
import ImpactChart from './ImpactChart'

type ImpactChartWithDataProps = {
	trend_type: TrendQueryProps['trend_type']
	sentiment_target: TrendQueryProps['sentiment_target']
	reset?: () => void
	unitLabel?: string
	icon?: keyof typeof icons
}

type ImpactChartErrorProps = Pick<ImpactChartWithDataProps, 'reset'> &
	ReturnType<typeof parseErrorMessage>

function ImpactChartError(props: ImpactChartErrorProps) {
	return (
		<div
			className={cn(
				'w-full min-h-96 p-8 border border-grayLight',
				'flex items-center justify-center bg-grayUltraLight',
			)}
		>
			<ComponentError
				errorMessage={props.message}
				errorDetails={props.details}
				reset={props.reset}
			/>
		</div>
	)
}

function ImpactChartLoading() {
	return <ChartLoadingPlaceholder />
}

function ImpactChartEmpty() {
	return (
		<div
			className={cn(
				'w-full min-h-96 p-8 border border-grayLight',
				'flex items-center justify-center bg-grayUltraLight',
			)}
		>
			<span>No data for the current configuration</span>
		</div>
	)
}

function ImpactChartWithData({
	reset,
	unitLabel = 'articles',
	trend_type = 'keywords',
	sentiment_target = null,
}: ImpactChartWithDataProps) {
	const { organisations } = useAllOrganisations()
	const orgs = useMemo(
		() => organisations.map(({ slug }) => slug),
		[organisations],
	)

	const [org1, setOrg1] = useState<EventOrganizerSlugType | undefined>(orgs[0])
	const [org2, setOrg2] = useState<EventOrganizerSlugType | undefined>(orgs[1])
	const [org3, setOrg3] = useState<EventOrganizerSlugType | undefined>(orgs[2])

	useEffect(() => {
		setOrg1(orgs[0])
		setOrg2(orgs[1])
		setOrg3(orgs[2])
	}, [orgs])

	const getUpdateOrgHandler = useCallback(
		(idx: number) => (slug: EventOrganizerSlugType) => {
			const orgChangeHandlers = [setOrg1, setOrg2, setOrg3]
			if (orgs.length === 0 || !slug) return
			const handler = orgChangeHandlers[idx] ?? (() => undefined)
			handler(slug)
		},
		[orgs],
	)

	const orgValues = [org1, org2, org3]
	const org1Query = useMediaImpactData({
		organizer: org1,
		trend_type,
		sentiment_target,
	})
	const org2Query = useMediaImpactData({
		organizer: org2,
		trend_type,
		sentiment_target,
	})
	const org3Query = useMediaImpactData({
		organizer: org3,
		trend_type,
		sentiment_target,
	})

	const queries = {} as Record<string, ReturnType<typeof useMediaImpactData>>
	if (org1) queries[org1] = org1Query
	if (org2) queries[org2] = org1Query
	if (org3) queries[org3] = org1Query

	const queriesArray = Array.from(Object.values(queries))
	const data = {} as Record<
		string,
		ReturnType<typeof useMediaImpactData>['data']
	>
	if (org1) data[org1] = org1Query.data
	if (org2) data[org2] = org2Query.data
	if (org3) data[org3] = org3Query.data

	const anyLoading =
		queriesArray.length === 0 || queriesArray.some((query) => query.isPending)
	const isEmpty =
		!anyLoading &&
		queriesArray.every(
			(query) => query?.data?.data && query.data.data.length === 0,
		)
	const allErroring =
		!anyLoading && queriesArray.every((query) => query.isError === true)
	if (allErroring) {
		const firstError = queriesArray.find((query) => query.error)?.error
		return <ImpactChartError reset={reset} {...parseErrorMessage(firstError)} />
	}
	if (isEmpty) return <ImpactChartEmpty />

	return (
		<ImpactChart
			columns={Object.entries(data).map(([key, d], idx) => ({
				id: key,
				data: d?.data || null,
				limitations: d?.limitations,
				error: queries[key as keyof typeof queries]?.error ?? null,
				org: orgValues[idx] as EventOrganizerSlugType,
				onOrgChange: getUpdateOrgHandler(idx),
				isPending: queries[key as keyof typeof queries]?.isPending ?? false,
			}))}
			columnsCount={3}
			itemsCountPerColumn={trend_type === 'keywords' ? 4 : 3}
			unitLabel={unitLabel}
		/>
	)
}

export default function ImpactChartWithErrorBoundary({
	trend_type = 'keywords',
	sentiment_target = null,
}: Pick<TrendQueryProps, 'trend_type' | 'sentiment_target'>) {
	return (
		<QueryErrorResetBoundary>
			{({ reset }) => (
				<ErrorBoundary
					errorComponent={({ error }) => (
						<ImpactChartError reset={reset} {...parseErrorMessage(error)} />
					)}
				>
					<Suspense fallback={<ImpactChartLoading />}>
						<ImpactChartWithData
							reset={reset}
							trend_type={trend_type}
							sentiment_target={sentiment_target}
						/>
					</Suspense>
				</ErrorBoundary>
			)}
		</QueryErrorResetBoundary>
	)
}
