'use client'

import ThemeToggle from '@components/ThemeToggle'
import Logo from '@components/logo'
import { useMenu } from '@refinedev/core'
import { cn } from '@utility/classNames'
import HeaderMenuLink from './HeaderMenuLink'

export const Menu = ({ currentPage }: { currentPage: string }) => {
	const { menuItems } = useMenu()

	console.log('currentPage', currentPage)
	console.log('menuItems', menuItems)
	return (
		<nav
			className={cn(
				'px-6 py-4 flex gap-6 flex-wrap items-center justify-between',
				'border-b border-grayLight',
			)}
		>
			<a
				href="/"
				title="Home"
				className="opacity-100 motion-safe:transition-opacity hover:opacity-80 focusable"
			>
				<Logo />
			</a>
			<ul
				className={cn(`flex flex-col md:flex-row md:gap-4 items-center`)}
				aria-label="Main menu items"
			>
				{menuItems.map((item) => (
					<HeaderMenuLink
						key={item.name}
						href={item.route ?? '/'}
						title={item.label ?? '-'}
						active={currentPage === item.name}
					/>
				))}
				<li
					aria-label="Main menu link: Other actions"
					className={cn(
						`w-full md:w-auto py-5 md:p-0 text-grayDark`,
						`flex justify-between items-center pr-5 md:pr-0`,
					)}
				>
					<div className="text-fg inline-flex items-center">
						<ThemeToggle />
					</div>
				</li>
			</ul>
		</nav>
	)
}
