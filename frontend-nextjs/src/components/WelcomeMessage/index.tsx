'use client'
import headerImage from '@images/header-bg.png'
import Image from 'next/image'
import { useEffect, useState } from 'react'

function WelcomeMessage() {
	const [isShowing, setIsShowing] = useState(false)

	useEffect(() => {
		if (typeof window !== 'undefined') return
		const preference = localStorage.getItem('showWelcomeMessage')
		const showWelcomeMessage = preference === 'true'
		if (showWelcomeMessage) {
			setIsShowing(true)
		}
	}, [])

	return (
		<section className="">
			<div className="w-full h-[88px] sm:h-[16vw] sm:min-h-40 bg-fg dark:bg-bg bg-blend-screen relative z-0">
				<Image
					src={headerImage}
					alt="A decorative header image of a crowd protesting"
					className="absolute w-screen h-[88px] sm:h-[16vw] sm:min-h-40 inset-0 object-cover mix-blend-screen opacity-40"
				/>
				<div
					className="absolute inset-0 w-screen h-[88px] sm:h-[16vw] sm:min-h-40 bg-repeat
            bg-center mix-blend-screen dark:mix-blend-multipy
            bg-[url(/images/noisy-dark.png)] dark:bg-[url(/images/noisy-inverted.png)]"
					aria-hidden="true"
				></div>
			</div>
		</section>
	)
}

export default WelcomeMessage
