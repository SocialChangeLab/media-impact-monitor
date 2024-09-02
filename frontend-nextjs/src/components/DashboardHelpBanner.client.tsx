'use client'
import { cn } from '@/utility/classNames'
import { texts } from '@/utility/textUtil'
import { motion } from 'framer-motion'
import { CornerLeftDown, CornerLeftUp, HelpCircle } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import InternalLink from './InternalLink'
import { Button, buttonVariants } from './ui/button'

type HelpBannerActions = {
	onExpand: () => void
	onCollapse: () => void
}

function ExpandedHelpBanner({ onCollapse }: HelpBannerActions) {
	return (
		<div className={cn('flex justify-between items-center relative')}>
			<div className="w-fit flex flex-col ">
				<h1
					className={cn(
						'font-headlines text-2xl lg:text-3xl font-bold',
						'flex items-center mb-1 lg:mb-3 antialiased gap-2',
						'leading-7',
					)}
				>
					{texts.info.welcome_message.heading}
				</h1>
				{texts.info.welcome_message.description.map((desc, i) => (
					<p
						key={`${desc}-${
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							i
						}`}
						className="text-sm lg:text-base max-w-prose text-pretty mt-1 mb-1 text-fg"
					>
						{desc}
					</p>
				))}
				<span className="flex gap-4 mt-5">
					<Button size="sm" onClick={onCollapse}>
						{texts.info.welcome_message.buttons.cta}
					</Button>{' '}
					<InternalLink
						className={cn(
							buttonVariants({ variant: 'outline', size: 'sm' }),
							'border-grayLight',
						)}
						href="/docs"
					>
						{texts.info.welcome_message.buttons.docs}
					</InternalLink>
				</span>
			</div>
			<span
				className={cn(
					'absolute gap-1 top-4 right-0 2xl:right-1/3 pointer-events-none',
					'hidden lg:flex',
				)}
				aria-hidden="true"
			>
				<CornerLeftUp
					className="-rotate-12 text-grayDark opacity-60"
					size={40}
					strokeWidth={1}
				/>
				<div className="flex gap-2 items-center font-semibold mt-4 -translate-x-3">
					<span className="size-6 rounded-full bg-fg text-bg flex items-center justify-center">
						1
					</span>
					<span>{texts.info.welcome_message.arrowHints.setYourFilters}</span>
				</div>
			</span>
			<span
				className={cn(
					'absolute flex gap-1 bottom-4 right-0 2xl:right-[15%] pointer-events-none',
					'hidden lg:flex',
				)}
				aria-hidden="true"
			>
				<CornerLeftDown
					className="rotate-6 mt-5 text-grayDark opacity-60"
					size={40}
					strokeWidth={1}
				/>
				<div className="flex gap-2 items-center font-semibold -translate-x-3">
					<span className="size-6 rounded-full bg-fg text-bg flex items-center justify-center">
						2
					</span>
					<span>{texts.info.welcome_message.arrowHints.scrollDown}</span>
				</div>
			</span>
		</div>
	)
}

function CollapsedHelpBanner({ onExpand }: HelpBannerActions) {
	return (
		<Button size="sm" variant="outline" onClick={onExpand}>
			<HelpCircle size={20} className="text-grayDark" />
			{texts.info.welcome_message.buttons.whatIsThis}
		</Button>
	)
}

function DashboardHelpBannerClient({
	defaultIsExpanded = true,
	persistIsExpanded = () => {},
}: {
	defaultIsExpanded?: boolean | undefined
	persistIsExpanded?: (value: boolean) => void
}) {
	const [isExpanded, setIsExpanded] = useState(defaultIsExpanded)

	const setIsExpandedValue = useCallback(
		(value: boolean) => {
			setIsExpanded(value)
			persistIsExpanded(value)
		},
		[persistIsExpanded],
	)

	const actions = useMemo(
		() => ({
			onExpand: () => setIsExpandedValue(true),
			onCollapse: () => setIsExpandedValue(false),
		}),
		[setIsExpandedValue],
	)

	return (
		<motion.section
			variants={{
				collapsed: {
					height: `3.6875rem`,
					paddingTop: `0.75rem`,
					paddingBottom: `0.75rem`,
				},
				expanded: {
					height: `20rem`,
					paddingTop: `1rem`,
					paddingBottom: `1rem`,
				},
			}}
			initial={isExpanded ? 'expanded' : 'collapsed'}
			animate={isExpanded ? 'expanded' : 'collapsed'}
			className={cn(
				'px-content overflow-clip flex flex-col justify-center',
				'border-b border-grayLight last-of-type:border-b-0',
			)}
		>
			{isExpanded ? (
				<ExpandedHelpBanner {...actions} />
			) : (
				<CollapsedHelpBanner {...actions} />
			)}
		</motion.section>
	)
}

export default DashboardHelpBannerClient
