import { cn } from '@/utility/classNames'
import { parseErrorMessage } from '@/utility/errorHandlingUtil'
import type { ParsedMediaImpactItemType } from '@/utility/mediaImpactUtil'
import {
	AlarmMinus,
	AlertTriangle,
	Asterisk,
	BadgeMinusIcon,
	Minus,
} from 'lucide-react'
import { useMemo } from 'react'
import ComponentError from '../ComponentError'

function ImpactChartColumnVisualisation({
	impacts,
	limitations = [],
	error,
	isPending = false,
}: {
	impacts: ParsedMediaImpactItemType[] | null
	limitations?: string[]
	error?: Error | null
	isPending?: boolean
}) {
	const hasLimitations = useMemo(
		() => !isPending && limitations.length > 0,
		[limitations, isPending],
	)
	return (
		<ImpactChartColumnVisualisationWrapper>
			{isPending && <div>Loading...</div>}
			{hasLimitations && (
				<ImpactChartColumnVisualisationLimitations limitations={limitations} />
			)}
			{error && <ImpactChartColumnVisualisationError error={error} />}
		</ImpactChartColumnVisualisationWrapper>
	)
}

function ImpactChartColumnVisualisationWrapper({
	children,
}: {
	children: React.ReactNode
}) {
	return <div className="bg-grayUltraLight h-96">{children}</div>
}

function ImpactChartColumnVisualisationLimitations({
	limitations,
}: {
	limitations: string[]
}) {
	return (
		<div className="w-full h-96 flex justify-center items-center">
			<div className="flex flex-col gap-2 max-w-96">
				<div className={cn('mb-1 w-fit h-fit')}>
					<Asterisk size={48} strokeWidth={1} className="text-grayMed -ml-3" />
				</div>
				<div className="mb-1 relative min-w-full grid grid-cols-[auto,1fr] items-center gap-4">
					<strong className="font-semibold">Limitation</strong>
					<div className="h-px w-full bg-grayLight"></div>
				</div>
				<p className="text-grayDark relative">
					The impact cannot be computed because of the following limitations:
				</p>
				<ul className="flex flex-col gap-2 list-disc marker:text-grayMed">
					{limitations.map((l) => (
						<li key={l} className="ml-4 pl-1 font-semibold">
							{l}
						</li>
					))}
				</ul>
				<p className="text-grayDark">
					Widen your filters or choose another organisation.
				</p>
			</div>
		</div>
	)
}

function ImpactChartColumnVisualisationError({ error }: { error: Error }) {
	const { message, details } = parseErrorMessage(error, 'Organisation impact')
	return (
		<div className="w-full h-96 flex justify-center items-center">
			<ComponentError errorMessage={message} errorDetails={details} />
		</div>
	)
}

export default ImpactChartColumnVisualisation
