'use client'

import '@/styles/global.css'
import Footer from '@components/Footer'
import { Breadcrumb } from '@components/breadcrumb'
import { cn } from '@utility/classNames'
import { PropsWithChildren, ReactNode } from 'react'
import { Menu } from '../menu'

export const Layout: React.FC<
	PropsWithChildren<{
		currentPage: string
		modal?: ReactNode
	}>
> = ({ children, currentPage, modal }) => {
	return (
		<div className="layout min-h-screen grid grid-rows-[auto_1fr_auto]">
			<Menu currentPage={currentPage} />
			<div className="relative">
				<div
					aria-hidden="true"
					className={cn(
						'absolute inset-0 bg-[url(/images/doc-shadow.png)] bg-no-repeat bg-right-top ',
						'dark:mix-blend-normal dark:invert',
						`pointer-events-none`,
					)}
				/>
				<div
					aria-hidden="true"
					className={cn(
						'absolute inset-0 bg-[url(/images/doc-shadow.png)] bg-no-repeat bg-right-top',
						'dark:mix-blend-normal dark:invert',
						'scale-x-[-1]',
						`pointer-events-none`,
					)}
				/>
				{!modal && <Breadcrumb />}
				<div className="px-6 py-4">{children}</div>
			</div>
			<Footer />
		</div>
	)
}
