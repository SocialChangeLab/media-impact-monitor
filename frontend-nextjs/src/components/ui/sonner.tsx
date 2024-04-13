'use client'

import { cn } from '@utility/classNames'
import { useTheme } from 'next-themes'
import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = 'system' } = useTheme()

	return (
		<Sonner
			theme={theme as ToasterProps['theme']}
			className="toaster group"
			toastOptions={{
				classNames: {
					toast: cn(
						'group toast group-[.toaster]:bg-bg group-[.toaster]:text-fg',
						'group-[.toaster]:border-grayMed group-[.toaster]:shadow-lg',
					),
					description: 'group-[.toast]:text-grayDark',
					actionButton: 'group-[.toast]:bg-fg group-[.toast]:text-bg',
					cancelButton: cn(
						'group-[.toast]:bg-bg group-[.toast]:text-fg group-[.toast]:border',
						'group-[.toast]:hover:bg-grayLight group-[.toast]:border-grayLight',
						'group-[.toast]:rounded-none',
					),
				},
			}}
			{...props}
		/>
	)
}

export { Toaster }
