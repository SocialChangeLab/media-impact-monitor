'use client'

import {
	Check,
	ChevronsUpDown,
	HeartHandshakeIcon,
	Loader2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from '@/components/ui/command'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/utility/classNames'
import type {
	EventOrganizerSlugType,
	OrganisationType,
} from '@/utility/eventsUtil'
import { texts } from '@/utility/textUtil'
import { useAllOrganisations } from '@/utility/useOrganisations'
import { useMemo, useState } from 'react'
import RoundedColorPill from './RoundedColorPill'

export function OrganisationsSelect({
	className,
	multiple = true,
	organisations,
	selectedOrganisations,
	onChange = () => {},
}: {
	className?: string
	multiple?: boolean
	organisations?: EventOrganizerSlugType[]
	selectedOrganisations: EventOrganizerSlugType[]
	onChange?: (orgs: EventOrganizerSlugType[]) => void
}) {
	const [open, setOpen] = useState(false)
	const { isPending, organisations: allOrganisations } = useAllOrganisations()

	const selectedOrgs = useMemo(() => {
		return selectedOrganisations
			.map((slug) => allOrganisations.find(({ slug: s }) => s === slug))
			.filter(Boolean) as OrganisationType[]
	}, [allOrganisations, selectedOrganisations])

	const orgsToSelectFrom = useMemo(() => {
		if (typeof organisations === 'undefined') return allOrganisations
		return (
			organisations.map((slug) =>
				allOrganisations.find(({ slug: s }) => s === slug),
			) || []
		).filter(Boolean) as OrganisationType[]
	}, [organisations, allOrganisations])

	const selectedOrganizerSlugs = useMemo(
		() => selectedOrgs?.map(({ slug }) => slug),
		[selectedOrgs],
	)
	const firstSelectedOrg = useMemo(
		() => selectedOrgs?.find(({ slug }) => slug === selectedOrganizerSlugs[0]),
		[selectedOrganizerSlugs, selectedOrgs],
	)
	const selectedColors = useMemo(() => {
		const colors = Array.from(
			selectedOrganizerSlugs.reduce((acc, orgSlug) => {
				const org = selectedOrgs.find(({ slug }) => slug === orgSlug)
				if (!org) return acc
				acc.add(org.color)
				return acc
			}, new Set<string>()),
		)
		return colors
	}, [selectedOrganizerSlugs, selectedOrgs])

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className={cn(
						'w-fit justify-between rounded-none max-md:gap-0',
						'hover:bg-grayLight hover:text-fg border-grayMed',
						'group transition-colors max-lg:px-2 max-lg:py-1',
						isPending && 'text-grayDark',
						className,
					)}
				>
					{(isPending || selectedOrganisations.length === 0) && (
						<>
							<div className="flex items-center gap-3">
								<HeartHandshakeIcon className="shrink-0 text-grayDark size-5 lg:size-6" />
								<span className="hidden md:inline text-sm lg:text-base">
									{texts.filters.organisations.selectOrganisation}
									{multiple ? 's' : ''}
								</span>
							</div>
							<Loader2
								className={cn(
									'w-0 h-3 lg:h-4 animate-spin duration-1000 text-grayMed transition-all opacity-0',
									'overflow-clip',
									isPending && 'opacity-100 w-3 lg:w-4',
								)}
								aria-hidden="true"
							/>
						</>
					)}
					{!isPending && selectedOrganisations.length === 1 && (
						<span className="grid grid-cols-[auto_1fr] gap-2 items-center">
							{multiple && (
								<RoundedColorPill
									color={firstSelectedOrg?.color ?? 'transparent'}
									className="shrink-0"
								/>
							)}
							<span
								className={cn(
									'truncate max-w-56 text-sm lg:text-base',
									multiple && 'hidden sm:inline',
								)}
							>
								{firstSelectedOrg?.name}
							</span>
						</span>
					)}
					{!isPending && selectedOrganisations.length > 1 && (
						<span className="flex items-center">
							{selectedColors.map((color) => {
								return (
									<RoundedColorPill
										key={color}
										color={color}
										className="-mr-2 xs:-mr-1 ring-2 ring-bg group-hover:ring-grayLight"
									/>
								)
							})}
						</span>
					)}
					<ChevronsUpDown
						size={16}
						className="-mt-1 ml-2 shrink-0 opacity-50"
					/>
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="w-fit max-w-[min(320px,100vw-(var(--pagePadding)*2))] p-0 max-h-[70lvh] overflow-y-auto z-[70] -translate-x-7 md:translate-x-0"
				align="start"
			>
				{!isPending && (
					<Command>
						<CommandInput
							placeholder="Search..."
							className="focus-visible:ring-inset focus-visible:ring-offset-0 outline-offset-0 border-0 border-l"
						/>
						<CommandEmpty>
							{texts.filters.organisations.noOrganisationsFound}
						</CommandEmpty>
						<CommandGroup>
							{multiple && (
								<CommandItem
									value="all"
									onSelect={() => {
										const newSlugs =
											selectedOrganizerSlugs.length === selectedOrgs.length
												? selectedOrganizerSlugs.length === 0
													? allOrganisations.map((x) => x.slug)
													: []
												: selectedOrganizerSlugs
										onChange(newSlugs)
									}}
								>
									{texts.filters.organisations.toggleAllNone}
								</CommandItem>
							)}
							{orgsToSelectFrom.map((org) => (
								<CommandItem
									key={org.slug}
									value={org.slug}
									onSelect={(currentValue: string) => {
										const alreadySelected = selectedOrganizerSlugs.includes(
											currentValue as EventOrganizerSlugType,
										)
										const newValues = alreadySelected
											? selectedOrganizerSlugs.filter(
													(slug) => slug !== currentValue,
											  )
											: [...selectedOrganizerSlugs, org.slug]
										const uniqueValues = Array.from(new Set(newValues))
										onChange(multiple ? uniqueValues : [org.slug])
										!multiple && setOpen(false)
									}}
								>
									<Check
										className={cn(
											'mr-2 h-4 w-4 shrink-0',
											selectedOrganisations.find((o) => o === org.slug)
												? 'opacity-100'
												: 'opacity-0',
										)}
									/>
									<span className="grid grid-cols-[auto_1fr] gap-2 items-center">
										<RoundedColorPill color={org.color} className="shrink-0" />
										<span className="truncate">{org.name}</span>
									</span>
								</CommandItem>
							))}
						</CommandGroup>
					</Command>
				)}
			</PopoverContent>
		</Popover>
	)
}
