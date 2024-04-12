'use client'

import { useTheme } from 'next-themes'

import { Button } from '@components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@components/ui/dropdown-menu'
import { cn } from '@utility/classNames'
import { Check, Laptop, MoonIcon, SunIcon, type LucideIcon } from 'lucide-react'

type ThemeOptionType = {
	name: string
	label: string
	Icon: LucideIcon
	predicate: (theme: string | undefined) => boolean
}

const themeOptions: ThemeOptionType[] = [
	{
		name: 'system',
		label: 'System',
		predicate: (theme) => theme !== 'light' && theme !== 'dark',
		Icon: Laptop,
	},
	{
		name: 'light',
		label: 'Light',
		predicate: (theme) => theme === 'light',
		Icon: SunIcon,
	},
	{
		name: 'dark',
		label: 'Dark',
		predicate: (theme) => theme === 'dark',
		Icon: MoonIcon,
	},
]

export default function ThemeToggle() {
	const { theme, setTheme } = useTheme()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon">
					{themeOptions.map((option, idx) => (
						<option.Icon
							key={option.name}
							className={cn(
								idx !== 0 && 'absolute',
								'rotate-90 scale-0 opacity-0 transition-all',
								option.predicate(theme) && 'rotate-0 scale-100 opacity-100',
							)}
						/>
					))}
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{themeOptions.map((option) => (
					<DropdownMenuItem
						key={option.name}
						onClick={() => setTheme(option.name)}
					>
						<div className="grid gap-2 items-center grid-cols-[auto_80px_auto]">
							<option.Icon />
							<span>{option.label}</span>
							<Check
								className={cn(
									'opacity-0',
									option.predicate(theme) && 'opacity-50',
								)}
							/>
						</div>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
