import headerImage from '@images/header-bg.png'
import Image from 'next/image'
import { PropsWithChildren } from 'react'

export default async function AboutPageLayout({
	children,
}: PropsWithChildren<{}>) {
	return (
		<>
			<div className="w-screen h-[88px] sm:h-[16vw] sm:min-h-40">
				<div className="w-full h-[88px] sm:h-[16vw] sm:min-h-40 bg-fg dark:bg-bg bg-blend-screen relative z-0">
					<Image
						src={headerImage}
						alt="A decorative header image of a crowd protesting"
						className="absolute w-screen h-[88px] sm:h-[16vw] sm:min-h-40 inset-0 object-cover mix-blend-screen opacity-40"
						priority
					/>
					<div
						className="absolute inset-0 w-screen h-[88px] sm:h-[16vw] sm:min-h-40 bg-repeat
            bg-center mix-blend-screen dark:mix-blend-multipy
            bg-[url(/images/noisy-dark.png)] dark:bg-[url(/images/noisy-inverted.png)]"
						aria-hidden="true"
					></div>
				</div>
			</div>
			<main className="flex flex-col min-h-[80vh] relative z-10">
				<div className="container max-w-4xl mx-auto flex flex-col items-center justify-center gap-4 -px-0.5 md:gap-10 md:px-6">
					<div
						className="flex justify-center w-full max-w-[100vw] p-8 lg:p-10 xl:p-12
            bg-gradient-to-b via-bg from-bg to-transparent
            sm:-mt-[10vw] relative z-10 shadow-[inset_0_2px_0_var(--fg)]"
					>
						<div
							aria-hidden="true"
							className="absolute w-screen h-screen top-[10vw] right-full pointer-events-none dark:invert dark:saturate-0 bg-right-top bg-no-repeat"
							style={{ backgroundImage: `url(/images/doc-shadow.png)` }}
						></div>
						<div
							aria-hidden="true"
							className="absolute w-screen h-screen top-[10vw] left-full pointer-events-none dark:invert dark:saturate-0 bg-right-top bg-no-repeat -scale-x-100"
							style={{ backgroundImage: `url(/images/doc-shadow.png)` }}
						></div>
						<div
							className="prose prose-fg dark:prose-invert relative pb-8 sm:py-8 m-0
            prose-headings:font-headlines prose-headings:antialiased
            prose-lead:font-headlines prose-lead:antialiased max-w-prose w-full
            prose-lead:text-2xl prose-lead:leading-snug
            prose-h1:text-4xl
            prose-h2:text-3xl
            prose-h3:text-2xl
            prose-h4:text-xl
            prose-a:focusable"
						>
							{children}
						</div>
					</div>
				</div>
			</main>
		</>
	)
}
