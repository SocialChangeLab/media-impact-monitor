import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/utility/classNames'

const buttonVariants = cva(
	cn(
		'inline-flex items-center justify-center whitespace-nowrap gap-2',
		'rounded-full text-lg font-medium transition-colors focusable',
		'disabled:pointer-events-none disabled:opacity-50 [&>svg]:-mt-1.5',
	),
	{
		variants: {
			variant: {
				default: 'bg-grayLight text-fg hover:bg-fg hover:text-bg',
				destructive: 'bg-fg text-bg hover:bg-bg hover:text-fg',
				outline:
					'border border-grayMed bg-bg hover:bg-fg hover:text-bg hover:border-fg',
				secondary: 'bg-grayLight text-fg hover:bg-fg hover:bg-bg',
				ghost: 'hover:bg-accent hover:text-accent-fg',
				link: 'text-primary underline-offset-4 hover:underline',
			},
			size: {
				default: 'h-9 px-4 pt-3 pb-2',
				sm: 'h-8 rounded-md px-3 text-xs',
				lg: 'h-10 rounded-md px-8',
				icon: 'h-9 w-9',
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
