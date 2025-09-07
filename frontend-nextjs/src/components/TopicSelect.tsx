import { Button } from '@/components/ui/button'
import { useFiltersStore } from '@/providers/FiltersStoreProvider'
import type { TopicType } from '@/stores/filtersStore'
import { cn } from '@/utility/classNames'
import { texts } from '@/utility/textUtil'
import { useMemo } from 'react'

export default function TopicSelect() {
	const topic = useFiltersStore(({ topic }) => topic)
	const setTopic = useFiltersStore(({ setTopic }) => setTopic)

	const options: { value: TopicType; label: string }[] = useMemo(
		() => [
			{
				value: 'climate_change',
				label: texts.filters.topic.values.climate_change,
			},
			{
				value: 'gaza_crisis',
				label: texts.filters.topic.values.gaza_crisis,
			},
		],
		[],
	)

	return (
		<div className="flex border border-grayMed bg-transparent overflow-hidden">
			{options.map((option, index) => (
				<Button
					key={option.value}
					variant="ghost"
					onClick={() => setTopic(option.value)}
					className={cn(
						'rounded-none h-9 px-3.5 py-5 text-sm lg:text-base transition-colors',
						'border-0 hover:bg-grayLight focus-visible:ring-inset max-lg:px-2 max-lg:py-1',
						topic === option.value
							? 'bg-fg text-bg hover:bg-fg hover:text-bg'
							: 'bg-transparent text-fg hover:bg-grayLight',
						index > 0 && 'border-l border-grayMed',
					)}
				>
					{option.label}
				</Button>
			))}
		</div>
	)
}
