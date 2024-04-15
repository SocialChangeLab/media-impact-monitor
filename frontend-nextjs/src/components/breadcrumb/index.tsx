'use client'

import { cn } from '@/utility/classNames'
import Link from 'next/link'

type BreadcrumbsType = {
	label: string
	href?: string
	icon?: React.ReactNode
}

export const Breadcrumb = ({
	breadcrumbs,
}: {
	breadcrumbs: BreadcrumbsType[]
}) => {
	if (breadcrumbs.length < 2) return null
	return (
		<ul className={cn('px-10 pb-6 text-lg flex gap-4 items-center')}>
			{breadcrumbs.map((breadcrumb, idx) => {
				return (
					<li
						key={`breadcrumb-${breadcrumb.label}`}
						className={cn('relative', idx !== 0 && 'pl-4')}
					>
						{idx !== 0 && (
							<span
								className={cn(
									'absolute w-px h-full top-0 left-0 bg-grayMed rotate-12',
								)}
							/>
						)}
						{breadcrumb.href ? (
							<Link
								href={breadcrumb.href}
								className={cn(
									'rounded-full transition-colors hover:bg-grayLight',
									`px-3 pt-1 pb-0.5 inline-flex -ml-3`,
								)}
							>
								{breadcrumb.label}
							</Link>
						) : (
							<span className="px-3 pt-1 pb-0.5 inline-flex text-grayDark">
								{breadcrumb.label}
							</span>
						)}
					</li>
				)
			})}
		</ul>
	)
}
