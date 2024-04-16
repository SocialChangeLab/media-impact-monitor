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
		<motion.div
			className={cn(
				'w-full bg-grayUltraLight h-[calc(100vh-17rem)] overflow-auto',
			)}
			ref={parentRef}
		>
			<div className="py-6 px-2 min-w-full min-h-full relative flex items-center justify-center">
				<motion.ul
					key={animationKey || 'events-timeline-chart-wrapper'}
					className={cn(
						'grid grid-flow-col grid-rows-[1fr_0.5px_auto]',
						'items-center justify-stretch gap-y-2 size-full',
					)}
					variants={fadeVariants}
					initial="initial"
					animate="enter"
					transition={{ staggerChildren: 0.01 }}
				>
					<motion.li
						variants={fadeVariants}
						key={`events-timeline-impact-legend`}
						className="grid grid-rows-subgrid row-span-3"
					>
						<span
							className={cn(
								'h-full opacity-75',
								'pointer-events-none relative',
							)}
						>
							<div
								className={cn(
									'text-grayDark [writing-mode:vertical-lr] [text-orientation:revert]',
									'flex items-center justify-center gap-2 text-sm',
									'absolute bottom-0 left-1/2 -translate-x-1/2',
								)}
							>
								<span className="rotate-180 whitespace-nowrap">
									Positive impact
								</span>
								<ArrowUp size={16} />
							</div>
						</span>
						<span className="w-full bg-grayMed"></span>
						<span
							className={cn(
								'h-full opacity-75',
								'pointer-events-none relative',
							)}
						>
							<div
								className={cn(
									'text-grayDark [writing-mode:vertical-lr] [text-orientation:revert]',
									'flex items-center justify-center gap-2 text-sm',
									'absolute top-0 left-1/2 -translate-x-1/2',
								)}
							>
								<ArrowDown size={16} />
								<span className="rotate-180 whitespace-nowrap">
									Negative impact
								</span>
							</div>
						</span>
					</motion.li>
					{children}
				</motion.ul>
			</div>
		</motion.div>
	)
}

export default EventsTimelineChartWrapper
