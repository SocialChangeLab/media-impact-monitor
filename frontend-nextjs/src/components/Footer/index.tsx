'use client'

import Logo from '@components/logo'
import { cn } from '@utility/classNames'
import { ArrowUp } from 'lucide-react'

const year = new Date().getFullYear()

function Footer() {
	return (
		<footer
			className="pt-6 pb-5 border-t border-grayMed relative"
			aria-label="Main page footer"
		>
			<section
				className={cn(
					`px-6 flex justify-between gap-4 flex-wrap uppercase items-center`,
					`tracking-wide text-grayDark`,
				)}
			>
				<span aria-label={`Copyright ${year}`}>{year}</span>
				<span>
					<Logo className="scale-75 text-grayDark" />
				</span>
				<button
					id="back-to-top"
					aria-label="Scroll to top"
					className={cn(
						`p-1 text-fg border border-transparent`,
						`hover:bg-grayUltraLight motion-safe:transition-colors`,
						`focusable hover:border-grayLight`,
					)}
					onClick={() => {
						window.scrollTo({ top: 0, behavior: 'smooth' })
					}}
				>
					<ArrowUp />
				</button>
			</section>
		</footer>
	)
}

export default Footer
