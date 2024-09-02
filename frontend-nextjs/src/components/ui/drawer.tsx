'use client'

import * as React from 'react'
import { Drawer as DrawerPrimitive } from 'vaul'

import { cn } from '@/utility/classNames'
import { X } from 'lucide-react'

const DrawerContext = React.createContext<{
	direction?: 'top' | 'bottom' | 'left' | 'right'
}>({
	direction: 'bottom',
})

const Drawer = ({
	shouldScaleBackground = true,
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
	<DrawerContext.Provider value={{ direction: props.direction }}>
		<DrawerPrimitive.Root
			shouldScaleBackground={shouldScaleBackground}
			{...props}
		/>
	</DrawerContext.Provider>
)
Drawer.displayName = 'Drawer'

const DrawerTrigger = DrawerPrimitive.Trigger

const DrawerPortal = DrawerPrimitive.Portal

const DrawerClose = DrawerPrimitive.Close

const DrawerOverlay = React.forwardRef<
	React.ElementRef<typeof DrawerPrimitive.Overlay>,
	React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
	<DrawerPrimitive.Overlay
		ref={ref}
		className={cn('fixed inset-0 z-50 bg-bgOverlay', className)}
		{...props}
	/>
))
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

const DrawerContent = React.forwardRef<
	React.ElementRef<typeof DrawerPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => {
	const { direction } = React.useContext(DrawerContext)
	return (
		<DrawerPortal>
			<DrawerOverlay />
			<DrawerPrimitive.Content
				ref={ref}
				className={cn(
					`focusable`,
					'fixed z-50 flex h-auto flex-col border-grayMed bg-bg',
					(!direction || direction === 'bottom') &&
						'bottom-0 mt-24 max-h-[90lvh] border-t inset-x-0',
					direction === 'right' &&
						'right-0 top-0 w-screen h-screen border-l max-w-96',
					className,
				)}
				tabIndex={-1}
				{...props}
			>
				{(!direction || direction === 'bottom') && (
					<div
						className={cn(
							'mx-auto mt-4 h-2 w-[100px] rounded-full bg-grayMed cursor-grab active:cursor-grabbing',
						)}
					/>
				)}
				{(direction === 'right' || direction === 'left') && (
					<DrawerPrimitive.Close
						className={cn(
							'absolute right-6 top-6 pointer-events-auto ring-offset-bg',
							'transition focusable bg-bg rounded-full p-1',
							'disabled:pointer-events-none data-[state=open]:bg-fg',
							'data-[state=open]:text-grayDark hover:bg-fg hover:text-bg',
						)}
					>
						<X />
						<span className="sr-only">Close</span>
					</DrawerPrimitive.Close>
				)}
				{children}
			</DrawerPrimitive.Content>
		</DrawerPortal>
	)
})
DrawerContent.displayName = 'DrawerContent'

const DrawerHeader = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn('grid gap-1.5 p-4 text-center sm:text-left', className)}
		{...props}
	/>
)
DrawerHeader.displayName = 'DrawerHeader'

const DrawerFooter = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn('mt-auto flex gap-4 justify-end p-4', className)}
		{...props}
	/>
)
DrawerFooter.displayName = 'DrawerFooter'

const DrawerTitle = React.forwardRef<
	React.ElementRef<typeof DrawerPrimitive.Title>,
	React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
	<DrawerPrimitive.Title
		ref={ref}
		className={cn(
			'text-lg font-semibold leading-none tracking-tight',
			className,
		)}
		{...props}
	/>
))
DrawerTitle.displayName = DrawerPrimitive.Title.displayName

const DrawerDescription = React.forwardRef<
	React.ElementRef<typeof DrawerPrimitive.Description>,
	React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
	<DrawerPrimitive.Description
		ref={ref}
		className={cn('text-sm text-grayDark', className)}
		{...props}
	/>
))
DrawerDescription.displayName = DrawerPrimitive.Description.displayName

export {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	DrawerPortal,
	DrawerTitle,
	DrawerTrigger,
}
