'use client'
import { fadeVariants } from '@/utility/animationUtil'
import { cn } from '@/utility/classNames'
import { motion } from 'framer-motion'
import { PropsWithChildren, useMemo, useRef } from 'react'

function EventsTimelineChartWrapper({
	children,
	animationKey,
}: PropsWithChildren<{ animationKey: string }>) {
	const parentRef = useRef<HTMLDivElement>(null)

	const toRender = useMemo(() => {
		return (
			<motion.div
				className={cn(
					'w-full bg-grayUltraLight h-[calc(100vh-17rem)] overflow-clip',
					'flex items-center justify-center cursor-grab active:cursor-grabbing',
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
					drag
					dragConstraints={parentRef}
					dragDirectionLock={true}
					dragSnapToOrigin={false}
				>
					{children}
				</motion.ul>
			</motion.div>
		)
	}, [animationKey, children])
	return toRender
}

export default EventsTimelineChartWrapper
