'use client'

import { Check, ChevronsUpDown } from 'lucide-react'

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
import { type ReactNode, useEffect, useState } from 'react'

type OptionType = {
	label: ReactNode
	value: string
}
export function Combobox({
	options,
	onChange = () => undefined,
	value: initialValue,
	searchable = false,
	className,
}: {
	options: OptionType[]
	searchable?: boolean
	onChange?: (value: string) => void
	value?: string
	className?: string
}) {
	const [open, setOpen] = useState(false)
	const [value, setValue] = useState(initialValue || options[0]?.value)

	useEffect(() => {
		if (!initialValue) return
		setValue(initialValue)
	}, [initialValue])

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className={cn(
						'w-fit justify-between rounded-none h-[38px]',
						'hover:bg-grayLight hover:text-fg border-grayLight',
						className,
					)}
				>
					{value
						? options.find((option) => option.value === value)?.label
						: 'Select value...'}
					<ChevronsUpDown
						size={16}
						className="-mt-1 ml-2 shrink-0 opacity-50"
					/>
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="w-fit max-w-96 p-0 max-h-[70lvh] overflow-y-auto"
				align="start"
			>
				<Command>
					{searchable && (
						<>
							<CommandInput
								placeholder="Search..."
								className="focus-visible:ring-inset focus-visible:ring-offset-0 outline-offset-0 border-0 border-l"
							/>
							<CommandEmpty>Nothing found.</CommandEmpty>
						</>
					)}
					<CommandGroup>
						{options.map((option) => (
							<CommandItem
								key={option.value}
								value={option.value}
								onSelect={(currentValue: OptionType['value']) => {
									const newValue = currentValue === value ? '' : currentValue
									setValue(newValue)
									onChange(newValue)
									setOpen(false)
								}}
							>
								<Check
									className={cn(
										'mr-2 h-4 w-4 shrink-0',
										value === option.value ? 'opacity-100' : 'opacity-0',
									)}
								/>
								{option.label}
							</CommandItem>
						))}
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
