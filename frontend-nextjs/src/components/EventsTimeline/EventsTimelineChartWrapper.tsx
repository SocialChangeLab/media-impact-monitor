'use client'
import { fadeVariants } from '@utility/animationUtil'
import { cn } from '@utility/classNames'
import { motion } from 'framer-motion'
import { PropsWithChildren, useRef } from 'react'

function EventsTimelineChartWrapper({ children }: PropsWithChildren<{}>) {
	const parentRef = useRef<HTMLDivElement>(null)
	return (
		<motion.div
			className={cn(
				'w-full bg-grayUltraLight h-[calc(100vh-17rem)] overflow-clip',
				'flex items-center justify-center cursor-grab active:cursor-grabbing',
			)}
			ref={parentRef}
		>
			<motion.ul
				key="events-timeline-chart-wrapper"
				id="events-timeline-chart-wrapper"
				className="flex gap-0.5 items-center justify-evenly w-full h-auto py-6"
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
}

export default EventsTimelineChartWrapper
