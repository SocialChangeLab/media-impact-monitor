import { texts } from '@/utility/textUtil'

export const metadata = {
	title: `${texts.mainNavigation.imprint} | ${texts.seo.siteTitle}`,
}

export default async function ImprintPage() {
	return (
		<>
			<h1 className="text-3xl">Imprint</h1>
			<p>
				<strong>Media Impact Monitor</strong>
				<br />
				David Pomerenke
				<br />
				Römerstr. 60
				<br />
				70180 Stuttgart
				<br />
				Germany
				<br />
				Email:{' '}
				<a href="mailto:team@mediaimpactmonitor.app">
					team@mediaimpactmonitor.app
				</a>
			</p>

			<p>
				<strong>Disclaimer</strong>
				<br />
				Despite careful content control, we assume no liability for the content
				of external links. The operators of the linked pages are solely
				responsible for their content.
			</p>

			<p>
				<strong>Privacy Policy</strong>
				<br />
				Please refer to our <a href="/privacy">Privacy Policy</a> for
				information on how we handle your personal data.
			</p>
		</>
	)
}
