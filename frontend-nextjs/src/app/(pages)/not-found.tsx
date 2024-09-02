import InternalLink from '@/components/InternalLink'
import { buttonVariants } from '@/components/ui/button'
import { texts } from '@/utility/textUtil'

export const metadata = {
	title: `${texts.mainNavigation.fourOFour} | ${texts.seo.siteTitle}`,
}

export default function NotFound() {
	return (
		<div className="min-h-[calc(100lvh-var(--headerHeight))] flex items-center justify-center">
			<div className="prose w-fit max-w-full p-content">
				<h1 className="mb-6 text-6xl xl:text-8xl font-headlines">404</h1>
				<h2 className="mb-2 mt-0 font-headlines text-3xl xl:text-4xl">
					{' '}
					{texts.fourOFour.heading}{' '}
				</h2>
				<p className="lead text-balance">{texts.fourOFour.description}</p>
				<InternalLink
					href={'/dashboard'}
					className={buttonVariants({ variant: 'default' })}
				>
					{texts.homepage.hero.buttons.goToDashboard}
				</InternalLink>
			</div>
		</div>
	)
}
