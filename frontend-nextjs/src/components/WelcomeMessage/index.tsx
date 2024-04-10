'use client'
import { Button } from '@components/ui/button'
import headerImage from '@images/header-bg.png'
import { cn } from '@utility/classNames'
import { X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

function WelcomeMessage() {
	const [isShowing, setIsShowing] = useState(false)

	useEffect(() => {
		if (typeof window === 'undefined') return
		const preference = localStorage.getItem('showWelcomeMessage')
		const showWelcomeMessage = preference === 'true'
		if (!preference || showWelcomeMessage) {
			setIsShowing(true)
		} else {
			setIsShowing(false)
		}
	}, [])

	const onHide = useCallback(() => {
		if (typeof window === 'undefined') return
		localStorage.setItem('showWelcomeMessage', 'false')
		setIsShowing(false)
	}, [setIsShowing])

	if (!isShowing) return null
	return (
		<section className="p-6 animate-in">
			<div className="w-full sm:min-h-40 bg-brandGreen bg-blend-screen relative z-0 shadow-xl">
				<Image
					src={headerImage}
					alt="A decorative header image of a crowd protesting"
					className="absolute -z-10 w-full h-full sm:min-h-40 inset-0 object-cover mix-blend-screen opacity-10"
					priority
				/>
				<div
					className="absolute -z-10 inset-0 w-full h-full sm:min-h-40 bg-repeat
            bg-center mix-blend-screen
            bg-[url(/images/noisy-dark.png)]"
					aria-hidden="true"
				></div>
				<div className="px-6 pt-6 pb-8 max-w-prose flex flex-col gap-4">
					<h1 className="text-3xl font-bold font-headlines antialiased text-brandWhite pr-12 md:pr-0">
						Welcome to the Media Impact Monitor
					</h1>
					<div className="flex flex-col gap-2">
						<p className="text-brandWhite">
							Welcome to the Media Impact Monitor, a collaborative project aimed
							at enabling protest groups and NGOs to evaluate their impact on
							public discourse.
						</p>
						<p className="text-brandWhite">
							Through the examination of various media sources, from local and
							national newspapers to social media and parliamentary debates, the
							tool provides a detailed view of how activism influences public
							discussion.
						</p>
						<p>
							<Link
								href="/about"
								className={cn(
									'text-brandWhite underline focusable focus-visible:ring-offset-0 focus-visible:ring-brandWhite',
									'p-2 -ml-2 hover:decoration-brandGreen',
								)}
							>{`Learn more about the project`}</Link>
						</p>
					</div>
					<div className="flex gap-4 flex-wrap pt-2">
						<Button
							onClick={onHide}
							className={cn(
								`text-brandGreen bg-brandWhite focus-visible:ring-offset-0`,
								`focus-visible:bg-brandGreen focus-visible:ring-brandWhite`,
								`focus-visible:text-brandWhite`,
							)}
						>
							{`Take the tour`}
						</Button>
						<Button
							onClick={onHide}
							variant="outline"
							className={cn(
								`text-brandWhite focus-visible:ring-offset-0`,
								`focus-visible:bg-brandGreen focus-visible:ring-brandWhite`,
								`focus-visible:text-brandWhite`,
							)}
						>
							{`I'll discover on my own`}
						</Button>
					</div>
					<Button
						onClick={onHide}
						className={cn(
							'absolute top-6 right-6 z-10 text-brandWhite',
							'focus-visible:ring-offset-0 focus-visible:ring-brandWhite',
							'focus-visible:bg-brandGreen hover:bg-brandGreen',
						)}
						variant="ghost"
						size="icon"
					>
						<X />
					</Button>
				</div>
			</div>
		</section>
	)
}

export default WelcomeMessage
