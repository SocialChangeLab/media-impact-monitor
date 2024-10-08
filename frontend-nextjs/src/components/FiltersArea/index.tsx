'use client'
import { useFiltersStore } from '@/providers/FiltersStoreProvider'
import { useUiStore } from '@/providers/UiStoreProvider'
import { cn } from '@/utility/classNames'
import { texts } from '@/utility/textUtil'
import { motion, useAnimationFrame } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { type ReactNode, memo, useMemo, useRef } from 'react'
import MediaSourceSelect from '../DataSourceSelect'
import DraggableTimeFilterRange from '../DraggableTimeFilterRange'
import { OrganisationsSelect } from '../OrganisationsSelect'
import TimeFilter from '../TimeFilter'
import {
	doesPathnameShowAnyFilter,
	doesPathnameShowMediaFilter,
	doesPathnameShowOrganisationsFilter,
	doesPathnameShowTimeFilter,
} from '../menu/HeaderMenu'

function FiltersArea() {
	const pathname = usePathname()
	const lastPathname = useRef(pathname)
	const isScrolledToTop = useUiStore((state) => state.isScrolledToTop)
	const organizerSlugs = useFiltersStore(({ organizers }) => organizers)
	const setOrganizers = useFiltersStore(({ setOrganizers }) => setOrganizers)
	const parentRef = useRef<HTMLElement>(null)

	const display = useMemo(() => {
		const any = doesPathnameShowAnyFilter(pathname)
		const media = doesPathnameShowMediaFilter(pathname)
		const organisations = doesPathnameShowOrganisationsFilter(pathname)
		const time = doesPathnameShowTimeFilter(pathname)
		const onlyTime = !media && !organisations && time
		return { any, media, organisations, time, onlyTime }
	}, [pathname])

	const lastHasAny = useRef(display.any)

	const previouslyShown = useMemo(() => {
		if (!lastPathname.current) return true
		const hasAny = doesPathnameShowAnyFilter(lastPathname.current)
		lastPathname.current = pathname
		return hasAny
	}, [pathname])

	const shouldExit = useMemo(() => {
		if (!lastHasAny.current) return display.any
		const wasShown = lastHasAny.current
		lastHasAny.current = display.any
		return wasShown && !display.any
	}, [display.any])

	useAnimationFrame(() => {
		if (!parentRef.current) return
		const height = parentRef.current.getBoundingClientRect().height
		document.documentElement.style.setProperty(
			'--filtersHeight',
			`${Math.floor(height)}px`,
		)
	})

	return (
		<motion.nav
			ref={parentRef}
			initial={previouslyShown ? 'visible' : 'hidden'}
			animate={display.any ? 'visible' : 'hidden'}
			exit="hidden"
			variants={{
				hidden: {
					transform: 'translateY(-100%)',
					opacity: 0,
					pointerEvents: 'none',
				},
				visible: {
					transform: 'translateY(0%)',
					opacity: 1,
					pointerEvents: 'auto',
				},
			}}
			transition={{
				duration: shouldExit ? 0.3 : 0,
				ease: 'circInOut',
			}}
			aria-label="Page filters"
			className={cn(
				`w-screen flex flex-col relative z-40 pointer-events-auto`,
				`px-content mx-auto maxPage:border-x maxPage:border-grayLight`,
				`border-b bg-pattern-soft max-w-page`,
				isScrolledToTop && `pointer-events-none`,
				isScrolledToTop ? `py-[max(0.25rem,1vmax)]` : `py-2`,
				isScrolledToTop ? `gap-[max(0.25rem,0.75vmax)]` : `gap-2`,
				isScrolledToTop
					? `border-grayLight`
					: `border-grayMed dark:border-grayLight`,
				!isScrolledToTop && `shadow-xl shadow-black/5 dark:shadow-black/30`,
			)}
		>
			<div
				className={cn(
					`flex gap-[max(1rem,2vmax)] justify-between flex-wrap items-center`,
				)}
			>
				{(display.media || display.organisations) && (
					<ul className="flex gap-4 lg:gap-6 items-center flex-wrap">
						{display.media && (
							<li className="flex flex-col gap-1 text-sm">
								<FilterLabel show={isScrolledToTop}>
									{texts.filters.mediaSource.label}:
								</FilterLabel>
								<MediaSourceSelect />
							</li>
						)}
						{display.organisations && (
							<li className="flex flex-col gap-1 text-sm">
								<FilterLabel show={isScrolledToTop}>
									{texts.filters.organisations.label}:
								</FilterLabel>
								<OrganisationsSelect
									multiple
									selectedOrganisations={organizerSlugs}
									onChange={setOrganizers}
								/>
							</li>
						)}
					</ul>
				)}
				{display.time && (
					<div className="flex flex-col gap-1 text-sm">
						<FilterLabel show={isScrolledToTop}>
							{texts.filters.timeRange.label}:
						</FilterLabel>
						<TimeFilter />
					</div>
				)}
			</div>
			<DraggableTimeFilterRange />
		</motion.nav>
	)
}

const FilterLabel = memo(
	({ children, show }: { children: ReactNode; show: boolean }) => (
		<div
			className={cn(
				'overflow-clip transition-all hidden lg:block',
				`duration-1000 ease-smooth-out`,
				show ? 'h-5' : 'h-0',
			)}
		>
			<span className="text-sm">{children}</span>
		</div>
	),
)

export default memo(FiltersArea)
