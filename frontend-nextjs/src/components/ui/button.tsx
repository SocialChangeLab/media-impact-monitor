import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/utility/classNames'

const buttonVariants = cva(
	cn(
		'inline-flex items-center justify-center whitespace-nowrap gap-2',
		'text-lg transition-colors focusable text-f',
		'disabled:pointer-events-none disabled:opacity-50',
		'border border-transparent w-fit no-underline',
	),
	{
		variants: {
			variant: {
				default: 'bg-fg text-bg hover:bg-grayDark hover:text-bg',
				destructive: 'bg-fg text-bg hover:bg-bg hover:text-fg',
				outline: ' border-grayMed bg-transparent hover:bg-grayLight',
				secondary: 'bg-grayLight text-fg hover:bg-fg hover:bg-bg',
				ghost: 'hover:bg-grayLight hover:text-fg',
				link: 'text-fg underline-offset-4 hover:underline-fg',
			},
			size: {
				default: 'h-9 px-3.5 py-5',
				sm: 'h-8 px-3 py-4 text-xs',
				lg: 'h-10 px-4 py-6 text-lg',
				icon: 'p-2',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
)

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : 'button'
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		)
	},
)
Button.displayName = 'Button'

export { Button, buttonVariants }
