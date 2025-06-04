import { Button } from '@/components/ui/button'
import { Command, CommandItem, CommandList } from '@/components/ui/command'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { useFiltersStore } from '@/providers/FiltersStoreProvider'
import type { MediaSourceType } from '@/stores/filtersStore'
import { cn } from '@/utility/classNames'
import { texts } from '@/utility/textUtil'
import {
	ChevronsUpDownIcon,
	GlobeIcon,
	InfoIcon,
	LinkIcon,
	type LucideIcon,
	NewspaperIcon,
	SearchIcon,
	Music2Icon
} from 'lucide-react'
import { useMemo, useState } from 'react'

type OptionType = {
	name: string
	value: MediaSourceType
	Icon: LucideIcon
	description: string
	links: {
		label: string
		href: string
	}[]
}

const options: OptionType[] = [
	{
		name: texts.filters.mediaSource.values.onlineNews.name,
		value: 'news_online',
		Icon: GlobeIcon,
		description: texts.filters.mediaSource.values.onlineNews.description,
		links: texts.filters.mediaSource.values.onlineNews.links,
	},
	{
		name: texts.filters.mediaSource.values.printNews.name,
		value: 'news_print',
		Icon: NewspaperIcon,
		description: texts.filters.mediaSource.values.printNews.description,
		links: texts.filters.mediaSource.values.printNews.links,
	},
	{
		name: texts.filters.mediaSource.values.tiktok.name,
		value: 'social_tiktok',
		Icon: Music2Icon,
		description: texts.filters.mediaSource.values.tiktok.description,
		links: texts.filters.mediaSource.values.tiktok.links,
	},
	{
		name: texts.filters.mediaSource.values.googleTrends.name,
		value: 'web_google',
		Icon: SearchIcon,
		description: texts.filters.mediaSource.values.googleTrends.description,
		links: texts.filters.mediaSource.values.googleTrends.links,
	},
]
const optionsMap = new Map(options.map((o) => [o.value, o]))

export default function MediaSourceSelect() {
	const mediaSource = useFiltersStore(({ mediaSource }) => mediaSource)
	const setMediaSource = useFiltersStore(({ setMediaSource }) => setMediaSource)
	const [isOpened, setIsOpened] = useState(false)
	const selectedValue = useMemo(
		() => (mediaSource && optionsMap.get(mediaSource)) || undefined,
		[mediaSource],
	)
	return (
		<Popover open={isOpened} onOpenChange={setIsOpened}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					className="w-fit justify-between max-lg:px-2 max-lg:py-1 max-md:gap-0"
				>
					<div className="flex items-center gap-3">
						{selectedValue && (
							<selectedValue.Icon
								size={20}
								className="mt-0 shrink-0 text-grayDark size-5 lg:size-6"
							/>
						)}
						<span className="hidden md:inline text-sm lg:text-base">
							{selectedValue?.name ||
								texts.filters.mediaSource.fieldPlaceholder}
						</span>
					</div>
					<ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="w-full max-w-[min(320px,100vw-(var(--pagePadding)*2))] p-0 rounded-none z-[70]"
				align="start"
			>
				<Command value={mediaSource}>
					<CommandList>
						{options.map((option) => (
							<CommandItem
								key={option.value}
								className={cn(
									'flex justify-between items-start group cursor-pointer',
									'aria-selected:bg-fg aria-selected:text-bg aria-selected:cursor-default',
									'hover:bg-grayUltraLight focusable ring-inset',
								)}
								value={option.value}
								onSelect={() => {
									setMediaSource(option.value)
									setIsOpened(false)
								}}
							>
								<TooltipProvider>
									<span className="flex items-start gap-3 text-left grow focusable focus-visible:bg-bg">
										<option.Icon
											size={20}
											className="mt-0.5 shrink-0 text-grayDark group-hover:text-fg group-aria-selected:text-bg"
										/>
										<div>
											<div className="font-medium">{option.name}</div>
											<p className="text-sm text-grayDark group-hover:text-fg group-aria-selected:text-bg">
												{option.description}
											</p>
										</div>
									</span>
									{option.links.length > 0 && (
										<Tooltip>
											<TooltipTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													className="focus-visible:bg-bg group-aria-selected:focus-visible:bg-fg -mt-1"
												>
													<InfoIcon className="h-4 w-4" />
												</Button>
											</TooltipTrigger>
											<TooltipContent className="w-fit space-y-2 rounded-none flex flex-col gap-2">
												{option.links.map((link) => (
													<a
														href={link.href}
														target="_blank"
														rel="noopener noreferrer"
														key={link.href}
														className="flex items-center gap-2 focusable"
													>
														<LinkIcon className="h-4 w-4 text-grayDark" />
														<span>{link.label}</span>
													</a>
												))}
											</TooltipContent>
										</Tooltip>
									)}
								</TooltipProvider>
							</CommandItem>
						))}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
