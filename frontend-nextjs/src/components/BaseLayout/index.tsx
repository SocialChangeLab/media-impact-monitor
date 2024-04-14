'use client'

import '@/styles/global.css'
import Footer from '@components/Footer'
import WelcomeMessage from '@components/WelcomeMessage'
import { Breadcrumb } from '@components/breadcrumb'
import { cn } from '@utility/classNames'
import { usePathname } from 'next/navigation'
import { PropsWithChildren, ReactNode } from 'react'
import { Menu } from '../menu'

export const BaseLayout: React.FC<PropsWithChildren<{ modal?: ReactNode }>> = ({
	children,
	modal,
}) => {
	const pathname = usePathname()
	const currentPage = pathname.split('/')[1] || 'events'
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
				<WelcomeMessage currentPage={currentPage} />
				{!modal && <Breadcrumb breadcrumbs={[]} />}
				<div className="min-h-full">{children}</div>
			</div>
			<Footer />
		</div>
	)
}
