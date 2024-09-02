import { texts } from '@/utility/textUtil'

export const metadata = {
	title: `${texts.mainNavigation.imprint} | ${texts.seo.siteTitle}`,
}

export default async function PrivacyPage() {
	return (
		<>
			<h1 className="text-3xl">Privacy Policy</h1>
			<p className="lead">
				At Media Impact Monitoring, we are committed to protecting your privacy.
				This policy explains how we collect, use, and safeguard your
				information.
			</p>

			<h2>Information We Collect</h2>
			<p>We collect the following types of information:</p>
			<ul>
				<li>
					<strong>Anonymized Information:</strong> We use{' '}
					<a href="https://sentry.io/">Sentry</a> to collect anonymized
					information about crash reports and performance. This helps us to
					improve our services and ensure a better user experience.
				</li>
				<li>
					<strong>Email Addresses:</strong> We collect email addresses via our
					newsletter form to keep you updated with our latest news and
					activities.
				</li>
				<li>
					<strong>Feedback Information:</strong> Through{' '}
					<a href="https://sentry.io/">Sentry</a>'s feedback functionality, we
					collect your name (if provided), email address, comments, and
					screenshots to better understand your experience and address any
					issues you may encounter.
				</li>
			</ul>

			<h2>Use of Information</h2>
			<p>
				The information we collect is used solely for the purpose of improving
				our services and communicating with you. As a non-profit organization,
				we have no intent to sell, redistribute, or use your data in any
				malicious way.
			</p>

			<h2>Data Sharing</h2>
			<p>
				We do not transfer your data to other parties. Your information is kept
				confidential and is only used internally to improve our services and
				communicate with you.
			</p>

			<h2>Data Deletion Requests</h2>
			<p>
				If you wish to request the deletion of your data, please contact us at{' '}
				<a href="mailto:davidpomerenke@mailbox.org">
					davidpomerenke@mailbox.org
				</a>
				. We will process your request promptly and ensure that your data is
				deleted from our records.
			</p>

			<h2>Contact Information</h2>
			<p>
				If you have any questions or concerns about our privacy policy, please
				contact David Pomerenke at{' '}
				<a href="mailto:davidpomerenke@mailbox.org">
					davidpomerenke@mailbox.org
				</a>
				.
			</p>
		</>
	)
}
