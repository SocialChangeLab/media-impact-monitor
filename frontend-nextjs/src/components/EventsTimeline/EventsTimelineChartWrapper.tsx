'use client'
import { fadeVariants } from '@/utility/animationUtil'
import { cn } from '@/utility/classNames'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowUp } from 'lucide-react'
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
		<div className="relative">
			<motion.div
				className={cn(
					'w-full bg-grayUltraLight h-[calc(100vh-17rem)] overflow-auto',
				)}
				ref={parentRef}
			>
				<motion.ul
					key={animationKey || 'events-timeline-chart-wrapper'}
					className={cn(
						'grid grid-flow-col grid-rows-[auto_0.5px_auto]',
						'items-center justify-stretch gap-y-2 size-full py-6',
					)}
					variants={fadeVariants}
					initial="initial"
					animate="enter"
					transition={{ staggerChildren: 0.01 }}
				>
					{children}
				</motion.ul>
			</motion.div>
			<span
				className={cn(
					'absolute z-10 text-grayDark top-4 left-5',
					'flex items-center gap-2 opacity-75',
					'pointer-events-none text-sm',
				)}
			>
				<ArrowUp size={16} />
				<span>Positive impact</span>
			</span>
			<span
				className={cn(
					'absolute z-10 text-grayDark bottom-4 left-5',
					'flex items-center gap-2 opacity-75',
					'pointer-events-none text-sm',
				)}
			>
				<ArrowDown size={16} />
				<span>Negative impact</span>
			</span>
		</div>
	)
}

export default EventsTimelineChartWrapper
