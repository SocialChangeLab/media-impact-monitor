'use client'
import { fadeVariants } from '@/utility/animationUtil'
import { cn } from '@/utility/classNames'
import { motion } from 'framer-motion'
import { PropsWithChildren, useEffect, useRef } from 'react'

function EventsTimelineChartWrapper({
	children,
	animationKey,
}: PropsWithChildren<{ animationKey: string }>) {
	const parentRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!parentRef.current) return
		const { clientHeight, scrollHeight } = parentRef.current
		const offsetToReachBottom = scrollHeight - clientHeight
		parentRef.current.scroll({ top: offsetToReachBottom })
	}, [children, animationKey])

	return (
		<motion.div
			className={cn(
				'w-full bg-grayUltraLight h-[calc(100vh-17rem)] overflow-auto',
			)}
			ref={parentRef}
		>
			<motion.ul
				key={animationKey || 'events-timeline-chart-wrapper'}
				className="grid grid-flow-col grid-rows-[auto_0.5px_auto] items-center justify-stretch gap-y-2 w-full h-auto py-6"
				variants={fadeVariants}
				initial="initial"
				animate="enter"
				transition={{ staggerChildren: 0.01 }}
			>
				{children}
			</motion.ul>
		</motion.div>
	)
}

export default EventsTimelineChartWrapper
