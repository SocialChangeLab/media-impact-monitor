import type { ReactNode } from 'react'
import { cn } from './classNames'

export function titleCase(str: string) {
	return str.replace(
		/\w\S*/g,
		(txt) => txt.charAt(0).toUpperCase() + txt.substr(1),
	)
}

type ImpactDescriptionProps = {
	isSentiment: boolean
	topicNode: ReactNode
	isIncreasing: boolean
	leastBound: string
	mostBound: string
}

type WrapperEl = ({ children }: { children: ReactNode }) => JSX.Element

const B: WrapperEl = ({ children }) => (
	<strong className="font-semibold text-fg">{children}</strong>
)

const textsEnGB = {
	language: 'en-GB',
	seo: {
		siteTitle: 'Media Impact Monitor',
		siteDescription:
			'A collaborative project aimed at enabling protest groups and NGOs to evaluate their impact on public discourse.',
	},
	mainNavigation: {
		home: 'Home',
		dashboard: 'Dashboard',
		organisations: 'Organisations',
		about: 'About',
		docs: 'Docs',
		fourOFour: 'Page not found',
		logoAssets: 'Logo assets',
		imprint: 'Imprint',
		dataPrivacy: 'Data Privacy',
		themeToggle: {
			light: 'Light',
			dark: 'Dark',
			system: 'System',
			toggleText: 'Toggle theme',
		},
	},
	fourOFour: {
		heading: 'This page does not exist',
		description:
			'It seems that the page you were looking for does not exist. Try the dashboard instead.',
	},
	errors: {
		heading: 'Error',
		buttons: {
			tryAgain: 'Try again',
			resetFilters: 'Reset all filters',
		},
		errorLoadingChartData: (
			{ chartName = 'chart' }: { chartName?: string } = { chartName: 'chart' },
		) => `Error fetching the ${chartName} data`,
		apiErrorTranslations: {
			defaultMessage: (
				{ datasetName = 'data' }: { datasetName?: string } = {
					datasetName: 'data',
				},
			) =>
				`There was an unexpected issue while retrieving the ${datasetName}. Please try again in a few minutes.`,
			ApiFetchError: (
				{ datasetName = 'data' }: { datasetName?: string } = {
					datasetName: 'data',
				},
			) =>
				`We are facing issues with our API and are unable to retrieve the ${datasetName}. Please try again in a few minutes.`,
			ZodError: (
				{ datasetName = 'data' }: { datasetName?: string } = {
					datasetName: 'data',
				},
			) =>
				`The ${datasetName} returned from the API are not in the expected format. Please try again in a few minutes or contact the developers.`,
			'An error has occured:  500': (
				{ datasetName = 'data' }: { datasetName?: string } = {
					datasetName: 'data',
				},
			) => 'There was an unexpected error: 500',
		},
	},
	footer: {
		links: {
			logoAssets: 'Logo assets',
			gitHub: 'GitHub',
			appStatus: 'App status',
			imprint: 'Imprint',
			privacy: 'Privacy',
		},
		copyRightOwner: 'Social Change Lab',
		hostedBy: 'Hosted by',
		sponsoredBy: 'Sponsored by',
	},
	homepage: {
		hero: {
			heading: 'Welcome to the Media Impact Monitor',
			text: [
				'The Media Impact Monitor is a collaborative project aimed at enabling protest groups and NGOs to evaluate their impact on public discourse.',
				'Through the examination of various media sources, from local and national newspapers to social media and parliamentary debates, the tool provides a detailed view of how activism influences public discussion.',
			],
			buttons: {
				goToDashboard: 'Go to the dashboard',
				about: 'About',
				docs: 'Documentation',
			},
			newsletterCallout: {
				heading: 'Get notified when we launch the v1!',
			},
			backgroundImage: {
				lightAlt: 'A screenshot of the dashboard (light mode)',
				darkAlt: 'A screenshot of the dashboard (dark mode)',
			},
		},
	},
	newsLetterSection: {
		heading: 'Receive updates and get notified when we launch the v1!',
		screenshotLightAlt: 'A screenshot of the dashboard (light mode)',
		screenshotDarkAlt: 'A screenshot of the dashboard (dark mode)',
		invalidEmail: 'Please enter a valid email address',
		inputLabel: 'What is your email address?',
		inputPlaceholder: 'anna.smith@example.com',
		submitButton: 'Subscribe',
	},
	uiCommon: {
		showMore: 'Show more',
		showLess: 'Show less',
		nextPageAriaLabel: 'Go to next page',
		prevPageAriaLabel: 'Go to previous page',
	},
	filters: {
		mediaSource: {
			label: 'Media source',
			fieldPlaceholder: 'Select data source',
			values: {
				onlineNews: {
					name: 'Online News',
					description: 'Articles in online news pages.',
					links: [
						{
							label: 'Official Website',
							href: 'https://www.mediacloud.org/',
						},
					],
				},
				printNews: {
					name: 'Print News',
					description: 'Articles in print newspapers.',
					links: [
						{
							label: 'Official Website',
							href: 'https://www.genios.de/',
						},
						{
							label: 'Press Page',
							href: 'https://www.genios.de/browse/Alle/Presse',
						},
					],
				},
				tiktok: {
					name: 'TikTok',
					description: 'Video posts on TikTok.',
					links: [
						{
							label: 'Official Website',
							href: 'https://www.tiktok.com/',
						},
					],
				},
				googleTrends: {
					name: 'Google Trends',
					description: 'Search trends on Google.',
					links: [
						{
							label: 'Official Website',
							href: 'https://trends.google.com/trends/',
						},
					],
				},
			},
		},
		organisations: {
			label: 'Organisations',
			selectOrganisation: 'Select organisation',
			noOrganisationsFound: 'No organisations found',
			toggleAllNone: 'Toggle all/none',
			unknownOrganisation: 'Unknown organisation',
		},
		timeRange: {
			label: 'Time range',
			presets: 'Presets',
			last6MonthsLong: 'Last 6 months',
			last6MonthsShort: '-6M',
			last12MonthsLong: 'Last 12 months',
			last12MonthsShort: '-12M',
			last30DaysLong: 'Last 30 days',
			last30DaysShort: '-30D',
			buttons: {
				apply: 'Apply',
				cancel: 'Cancel',
				resetDefaults: 'Reset defaults',
			},
		},
		topic: {
			label: 'Topic',
			values: {
				climate_change: 'Climate Crisis',
				gaza_crisis: 'Gaza Crisis',
			},
		},
	},
	info: {
		welcome_message: {
			heading: 'The Impact Monitor Dashboard',
			description: [
				'Welcome to the Impact Monitor Dashboard. Here, you can see protests over time, topics, and sentiments within the media and how protest organisations impact the media landscape.',
				'Start by setting the filters at the top of the page and scroll down to explore the data.',
			],
			buttons: {
				cta: 'Got it',
				docs: 'Learn more',
				whatIsThis: 'What is this dashboard?',
			},
			arrowHints: {
				setYourFilters: 'Set your filters',
				scrollDown: 'Scroll down to explore',
			},
		},
	},
	charts: {
		help: {
			howToReadThis: 'How to read this chart',
			readInTheDocs: 'Read in the docs',
			tabs: {
				info: 'Info',
				methodology: 'Methodology',
				data: 'Data',
			},
		},
		common: {
			legend: 'Legend',
			dataCredit: 'Data credit',
			articlesUnit: 'articles',
			total: 'Total',
			loading: 'Loading chart data...',
			cantShowThisChart: {
				heading: "Chart unavailable for selected data source",
				text: 'Given the the following limitations:',
				limitationTranslations: {
					// CAUTION: The text below is the the original message from the API
					// used as s key to translate it. Only change the value on the right
					// of the colon ":"
					'Sentiment trend requires fulltext analysis, which is only available for news_online, not web_google.': `This chart can only be displayed when selecting the media source "Online News", for which we can collect fulltexts and perform sentiment analysis. The source "Google Trends" is not supported.`,
					'Sentiment trend requires fulltext analysis, which is only available for news_online, not news_print.': `This chart can only be displayed when selecting the media source "Online News", for which we can collect fulltexts and perform sentiment analysis. The source "Print News" is not supported, because we are still working on integrating fulltext analysis for print news.`,
				},
			},
		},
		topics: {
			positive: 'Positive',
			negative: 'Negative',
			neutral: 'Neutral',
			'climate activism': 'Climate Activism',
			'climate crisis framing': 'Climate Crisis Framing',
			'climate policy': 'Climate Policy',
			'climate science': 'Climate Science',
		},
		aggregationUnit: {
			day: 'day',
			week: 'week',
			month: 'month',
			year: 'year',
		},
		keywordsTooltip: {
			intro: ({
				categoryNode,
				keywordsCount,
			}: {
				categoryNode: ReactNode
				keywordsCount: number | string
			}) => (
				<>
					The category {categoryNode} encompasses articles including one or more
					of the following {keywordsCount} keywords:
				</>
			),
			andText: ({ keywordsCount }: { keywordsCount: number | string }) =>
				`And one or many of the following ${keywordsCount} keywords:`,
		},
		sentimentTooltip: {
			intro: (
				<>
					We use an <B>AI Language Model</B> (LLM) to predict the sentiment of
					articles.
				</>
			),
			linkToDocs: ({ LinkWrapper }: { LinkWrapper: WrapperEl }) => (
				<>
					To learn more about the methodology, see the{' '}
					<LinkWrapper>documentation</LinkWrapper>.
				</>
			),
		},
		impact: {
			buttons: {
				computeImpacts: 'Compute impacts',
				hideComputedImpacts: 'Hide computed impacts',
			},
			tooltips: {
				upTo: 'Up to',
				downTo: 'Down to',
				atLeast: 'At least',
				noImpact: 'No impact',
			},
			disclaimer: {
				title: 'Caution!',
				description:
					'The results shown below are flawed and for demo purposes only. We are still working on integrating  reliable and validated impact estimation methods.',
			},
			descriptions: {
				unclearChange: ({ isSentiment, topicNode }: ImpactDescriptionProps) => (
					<>
						{`shows `}
						<B>no clear evidence</B>
						{` of an increase or decrease in the publication of `}
						{isSentiment && <> {topicNode} </>}
						{` articles `}
						{!isSentiment && <>about {topicNode}</>}
					</>
				),
				clearChange: ({
					isIncreasing,
					isSentiment,
					topicNode,
					leastBound,
					mostBound,
				}: ImpactDescriptionProps) => (
					<>
						{`shows ${isIncreasing ? `an ` : `a `}`}
						<B>{isIncreasing ? 'increase' : 'decrease'}</B>
						{` in the publication of `}
						{isSentiment && <> {topicNode} </>}
						{` articles `}
						{!isSentiment && <>about {topicNode}</>}
						{' by at least '}
						<B>{leastBound}</B>
						{` and up to `}
						<B>{mostBound}</B>
						{` articles`}
					</>
				),
				noChange: ({ isSentiment, topicNode }: ImpactDescriptionProps) => (
					<>
						{`shows `}
						<B>no impact</B>
						{` in the publication of `}
						{isSentiment && <> {topicNode} </>}
						{` articles `}
						{!isSentiment && <>about {topicNode}</>}
					</>
				),
			},
			limitation: {
				title: 'Limitation',
				message: ({ organisationNode }: { organisationNode: ReactNode }) => (
					<>
						The impact of an average protest by {organisationNode} cannot be
						computed because of the following limitations:
					</>
				),
				widenYourFilters: 'Widen your filters or choose another organisation.',
				limitationTranslations: {
					'Not enough events to estimate impact.':
						'Not enough events to estimate impact.',
				},
			},
			error: {
				message:
					'The impact cannot be computed because of the following error:',
				changeYourFilters:
					'Change your filters or choose another organisation.',
			},
			introduction: {
				message: ({
					organisationNode,
					selectedTimeFrameNode,
				}: {
					organisationNode: ReactNode
					selectedTimeFrameNode: ReactNode
				}) => (
					<>
						An average protest by {organisationNode} within the{' '}
						{selectedTimeFrameNode}
					</>
				),
				selectedTimeFrame: {
					label: 'selected timeframe',
					tooltipMessage: ({
						fromNode,
						toNode,
					}: {
						fromNode: ReactNode
						toNode: ReactNode
					}) => (
						<>
							The selected timeframe is: <br /> {fromNode} to {toNode}.
						</>
					),
					tooltipNotice: ({
						percentageNode,
						organisationNode,
					}: {
						percentageNode: ReactNode
						organisationNode: ReactNode
					}) => (
						<>
							Only {percentageNode} of protests by {organisationNode} are
							within the selected timeframe. Select a longer timeframe to get a
							more reliable impact estimate.
						</>
					),
				},
			},
		},
		protest_timeline: {
			heading: 'What protests are happening?',
			description: [
				'See protests over time for all selected organisations.',
				'Hover or click on the bubbles for more information on individual protest events.',
				'Currently, we cover climate protests in Germany since 2020.',
			],
			data_credit: [
				{
					label: 'Protest data',
					links: [
						{
							text: 'Armed Conflict Location & Event Data Project (ACLED)',
							url: 'https://acleddata.com/',
						},
					],
				},
			],
			legend: {
				size: 'Size',
				participants: {
					day: 'Protest participants',
					week: 'Weekly participants',
					month: 'Monthly participants',
					year: 'Yearly participants',
				},
				zeroOrUnknown: '0 or unknown',
				color: 'Color',
				organisations: 'Organisations',
				other: 'Other',
			},
			tooltips: {
				aggregated: ({
					timeUnitLabel,
					timeValue,
					protestCount,
					participantCount,
					orgsCount,
				}: {
					timeUnitLabel: string
					timeValue: string
					protestCount: number
					participantCount: number | undefined
					orgsCount: number
				}) => (
					<>
						The {timeUnitLabel} of <B>{timeValue}</B> saw a total of{' '}
						<B>
							{protestCount.toLocaleString('en-GB')} protest
							{protestCount > 1 && 's'}
						</B>
						{participantCount && (
							<>
								, comprising of{' '}
								<B>
									{participantCount.toLocaleString('en-GB')} participant
									{participantCount > 1 && 's'}
								</B>
							</>
						)}
						{`, and ${protestCount > 1 ? 'were' : 'was'} organized by the following organisation${orgsCount > 1 ? 's' : ''}:`}
					</>
				),
			},
		},
		topics_trend: {
			heading: 'How prominent are the issues in public discourse?',
			description: [
				'See how many articles are published on various topics over time.',
				'Use the filters to switch between online newspaper articles, print newspaper articles, and queries that people search for on Google.',
			],
			data_credit: [
				{
					label: 'Media data',
					links: [
						{
							text: 'MediaCloud',
							url: 'https://mediacloud.org/',
						},
					],
				},
			],
		},

		topics_impact: {
			heading: 'Computed impacts',
			description:
				'See how a protest by an organisation influences the publication of articles about climate change (by topics).',
		},
		sentiment_protest: {
			heading: 'What sentiment does the media show towards the protests?',
			description: [
				"See whether the media's coverage of the protests is more positive, negative, or neutral.",
			],
			data_credit: [
				{
					label: 'Media data',
					links: [
						{
							text: 'MediaCloud',
							url: 'https://mediacloud.org/',
						},
					],
				},
			],
		},
		sentiment_protest_impact: {
			heading: 'Computed impacts',
			description:
				'See how a protest by an organisation influences the publication of articles about climate activism (by sentiment).',
		},
		sentiment_policy: {
			heading:
				'What stance does the media have towards progressive climate policies?',
			description: [
				'See whether the media supports or opposes policies aimed at mitigating climate change.',
			],
			data_credit: [
				{
					label: 'Media data',
					links: [
						{
							text: 'MediaCloud',
							url: 'https://mediacloud.org/',
						},
					],
				},
			],
		},
		sentiment_policy_impact: {
			heading: 'Computed impacts',
			description:
				'See how a protest by an organisation influences the publication of articles about climate policies (by sentiment).',
		},
	},
	organisationsPage: {
		heading: 'Organisations Overview',
		description: ({
			isSameDay,
			formattedFrom,
			formattedTo,
			orgsCount,
		}: {
			isSameDay: boolean
			formattedFrom: string
			formattedTo: string
			orgsCount: number
		}) => {
			const formattedDate = isSameDay
				? `on ${formattedFrom}`
				: `between ${formattedFrom} and ${formattedTo}`
			const organisersCount =
				orgsCount > 0
					? `the ${orgsCount} selected organisation${orgsCount > 1 ? 's' : ''}`
					: 'all organisations'
			return `An overview of ${organisersCount} with protests ${formattedDate}. You can use the filters above to change the date range or select specific organisations.`
		},
		allOrganisations: 'All organisations',
		showPartnersAriaLabel: 'Show partners tooltip',
		propertyNames: {
			name: 'Name',
			totalEvents: 'Total Events',
			totalParticipants: 'Total Participants',
			avgParticipants: 'Avg. Participants',
			totalPartners: 'Partners',
		},
		adBanner: {
			heading: ({ organisationNode }: { organisationNode: ReactNode }) => (
				<>Interested in a deeper analysis for {organisationNode}?</>
			),
			description: ({ organisationNode }: { organisationNode: ReactNode }) => (
				<>
					If you are a member of {organisationNode} and wondering about your media impact, then we would love to cooperate with you, for example by providing a custom dashboard for your organisation.
				</>
			),
			buttons: {
				contactUs: 'Contact us',
			},
		},
	},
	singleProtestPage: {
		heading: ({
			formattedDate,
			orgsCount,
			orgName,
		}: {
			formattedDate: string
			orgsCount: number
			orgName: string
		}) =>
			cn(
				`Protest on ${formattedDate}`,
				orgsCount > 1 && 'multiple organisations',
				orgsCount === 1 && orgName,
			),
		propertyNames: {
			city: 'City',
			country: 'Country',
			organisations: 'Organisations',
		},
		table: {
			heading: 'Protest Articles',
			description: 'See which articles mention the protest',
			header: {
				title: 'Title',
				summary: 'Summary',
				date: 'Date',
				url: 'URL',
				sentimentActivism: 'Sent. Activism',
				sentimentPolicy: 'Sent. Policy',
			},
		},
		charts: {
			heading: 'Protest Timeline of Sentiment',
			description:
				'See the sentiment towards activism of articles related to the protest',
			sentimentTowards: ({ topicNode }: { topicNode: ReactNode }) => (
				<>Sentiment towards {topicNode}</>
			),
		},
	},
	docsPage: {
		documentation: 'Documentation',
		nextPage: 'Next page',
		prevPage: 'Previous page',
		contents: 'Contents',
		onThisPage: 'On this page',
		tocAriaLabel: 'Table of contents of the documentation',
		tocButtonText: 'Contents',
		tocNoContentsFound: 'No headings found on this page.',
	},
}

const textsXXX = {
	language: 'XXX',
	seo: {
		siteTitle: 'XXX',
		siteDescription: 'XXX',
	},
	mainNavigation: {
		home: 'XXX',
		dashboard: 'XXX',
		organisations: 'XXX',
		about: 'XXX',
		docs: 'XXX',
		fourOFour: 'XXX',
		logoAssets: 'XXX',
		imprint: 'XXX',
		dataPrivacy: 'XXX',
		themeToggle: {
			light: 'XXX',
			dark: 'XXX',
			system: 'XXX',
			toggleText: 'XXX',
		},
	},
	fourOFour: {
		heading: 'XXX',
		description: 'XXX',
	},
	errors: {
		heading: 'XXX',
		buttons: {
			tryAgain: 'XXX',
			resetFilters: 'XXX',
		},
		errorLoadingChartData: (
			{ chartName = 'XXX' }: { chartName?: string } = { chartName: 'XXX' },
		) => `XXX ${chartName} XXX`,
		apiErrorTranslations: {
			defaultMessage: (
				{ datasetName = 'XXX' }: { datasetName?: string } = {
					datasetName: 'XXX',
				},
			) => `XXX ${datasetName}. XXX.`,
			ApiFetchError: (
				{ datasetName = 'XXX' }: { datasetName?: string } = {
					datasetName: 'XXX',
				},
			) => `XXX`,
			ZodError: (
				{ datasetName = 'XXX' }: { datasetName?: string } = {
					datasetName: 'XXX',
				},
			) => `XXX ${datasetName} XXX`,
			'An error has occured:  500': (
				{ datasetName = 'data' }: { datasetName?: string } = {
					datasetName: 'data',
				},
			) => 'XXX',
		},
	},
	footer: {
		links: {
			logoAssets: 'XXX',
			gitHub: 'XXX',
			appStatus: 'XXX',
			imprint: 'XXX',
			privacy: 'XXX',
		},
		copyRightOwner: 'XXX',
		hostedBy: 'XXX',
		sponsoredBy: 'XXX',
	},
	homepage: {
		hero: {
			heading: 'XXX',
			text: ['XXX', 'XXX'],
			buttons: {
				goToDashboard: 'XXX',
				about: 'XXX',
				docs: 'XXX',
			},
			newsletterCallout: {
				heading: 'XXX',
			},
			backgroundImage: {
				lightAlt: 'XXX',
				darkAlt: 'XXX',
			},
		},
	},
	newsLetterSection: {
		heading: 'XXX',
		screenshotLightAlt: 'XXX',
		screenshotDarkAlt: 'XXX',
		invalidEmail: 'XXX',
		inputLabel: 'XXX',
		inputPlaceholder: 'XXX',
		submitButton: 'XXX',
	},
	uiCommon: {
		showMore: 'XXX',
		showLess: 'XXX',
		nextPageAriaLabel: 'XXX',
		prevPageAriaLabel: 'XXX',
	},
	filters: {
		mediaSource: {
			label: 'XXX',
			fieldPlaceholder: 'XXX',
			values: {
				onlineNews: {
					name: 'XXX',
					description: 'XXX',
					links: [
						{
							label: 'XXX',
							href: 'XXX',
						},
					],
				},
				printNews: {
					name: 'XXX',
					description: 'XXX',
					links: [
						{
							label: 'XXX',
							href: 'XXX',
						},
						{
							label: 'XXX',
							href: 'XXX',
						},
					],
				},
				tiktok: {
					name: 'XXX',
					description: 'XXX',
					links: [
						{
							label: 'XXX',
							href: 'XXX',
						},
					],
				},
				googleTrends: {
					name: 'XXX',
					description: 'XXX',
					links: [
						{
							label: 'XXX',
							href: 'XXX',
						},
					],
				},
			},
		},
		organisations: {
			label: 'XXX',
			selectOrganisation: 'XXX',
			noOrganisationsFound: 'XXX',
			toggleAllNone: 'XXX',
			unknownOrganisation: 'XXX',
		},
		timeRange: {
			label: 'XXX',
			presets: 'XXX',
			last6MonthsLong: 'XXX',
			last6MonthsShort: 'XXX',
			last12MonthsLong: 'XXX',
			last12MonthsShort: 'XXX',
			last30DaysLong: 'XXX',
			last30DaysShort: 'XXX',
			buttons: {
				apply: 'XXX',
				cancel: 'XXX',
				resetDefaults: 'XXX',
			},
		},
		topic: {
			label: 'XXX',
			values: {
				climate_change: 'XXX',
				gaza_crisis: 'XXX',
			},
		},
	},
	info: {
		welcome_message: {
			heading: 'XXX',
			description: ['XXX', 'XXX'],
			buttons: {
				cta: 'XXX',
				docs: 'XXX',
				whatIsThis: 'XXX',
			},
			arrowHints: {
				setYourFilters: 'XXX',
				scrollDown: 'XXX',
			},
		},
	},
	charts: {
		help: {
			howToReadThis: 'XXX',
			readInTheDocs: 'XXX',
			tabs: {
				info: 'XXX',
				methodology: 'XXX',
				data: 'XXX',
			},
		},
		common: {
			legend: 'XXX',
			articlesUnit: 'XXX',
			total: 'XXX',
			dataCredit: 'XXX',
			loading: 'XXX...',
			cantShowThisChart: {
				heading: 'XXX',
				text: 'XXX',
				limitationTranslations: {
					// CAUTION: The text below is the the original message from the API
					// used as s key to translate it. Only change the value on the right
					// of the colon ":"
					'Sentiment trend requires fulltext analysis, which is only available for news_online, not web_google.': `XXX`,
					'Sentiment trend requires fulltext analysis, which is only available for news_online, not news_print.': `XXX`,
				},
			},
		},
		topics: {
			positive: 'XXX',
			negative: 'XXX',
			neutral: 'XXX',
			'climate activism': 'XXX',
			'climate crisis framing': 'XXX',
			'climate policy': 'XXX',
			'climate science': 'XXX',
		},
		aggregationUnit: {
			day: 'XXX',
			week: 'XXX',
			month: 'XXX',
			year: 'XXX',
		},
		keywordsTooltip: {
			intro: ({
				categoryNode,
				keywordsCount,
			}: {
				categoryNode: ReactNode
				keywordsCount: number | string
			}) => (
				<>
					XXX {categoryNode} XXX {keywordsCount} XXX
				</>
			),
			andText: ({ keywordsCount }: { keywordsCount: number | string }) =>
				`XXX ${keywordsCount} XXX`,
		},
		sentimentTooltip: {
			intro: (
				<>
					XXX <B>XXX</B> XXX
				</>
			),
			linkToDocs: ({ LinkWrapper }: { LinkWrapper: WrapperEl }) => (
				<>
					XXX <LinkWrapper>XXX</LinkWrapper>.
				</>
			),
		},
		impact: {
			buttons: {
				computeImpacts: 'XXX',
				hideComputedImpacts: 'XXX',
			},
			tooltips: {
				upTo: 'XXX',
				downTo: 'XXX',
				atLeast: 'XXX',
				noImpact: 'XXX',
			},
			disclaimer: {
				title: 'XXX',
				description: 'XXX',
			},
			descriptions: {
				unclearChange: ({ isSentiment, topicNode }: ImpactDescriptionProps) => (
					<>
						XXX <B>XXX</B> XXX {isSentiment && <> {topicNode} </>} XXX{' '}
						{topicNode} XXX
					</>
				),
				clearChange: ({
					isIncreasing,
					isSentiment,
					topicNode,
					leastBound,
					mostBound,
				}: ImpactDescriptionProps) => (
					<>
						XXX <B>{isIncreasing ? 'XXX' : 'XXX'}</B> XXX{' '}
						{isSentiment && <> {topicNode} </>} XXX {topicNode} XXX{' '}
						<B>{leastBound}</B> XXX <B>{mostBound}</B> XXX
					</>
				),
				noChange: ({ isSentiment, topicNode }: ImpactDescriptionProps) => (
					<>
						XXX <B>XXX</B> XXX {isSentiment && <> {topicNode} </>} XXX{' '}
						{topicNode} XXX
					</>
				),
			},
			limitation: {
				title: 'XXX',
				message: ({ organisationNode }: { organisationNode: ReactNode }) => (
					<>XXX {organisationNode} XXX</>
				),
				widenYourFilters: 'XXX',
				limitationTranslations: {
					'Not enough events to estimate impact.': 'XXX',
				},
			},
			error: {
				message: 'XXX',
				changeYourFilters: 'XXX',
			},
			introduction: {
				message: ({
					organisationNode,
					selectedTimeFrameNode,
				}: {
					organisationNode: ReactNode
					selectedTimeFrameNode: ReactNode
				}) => (
					<>
						XXX {organisationNode} XXX {selectedTimeFrameNode}
					</>
				),
				selectedTimeFrame: {
					label: 'XXX',
					tooltipMessage: ({
						fromNode,
						toNode,
					}: {
						fromNode: ReactNode
						toNode: ReactNode
					}) => (
						<>
							XXX <br /> {fromNode} XXX {toNode}.
						</>
					),
					tooltipNotice: ({
						percentageNode,
						organisationNode,
					}: {
						percentageNode: ReactNode
						organisationNode: ReactNode
					}) => (
						<>
							XXX {percentageNode} XXX {organisationNode} XXX
						</>
					),
				},
			},
		},
		protest_timeline: {
			heading: 'XXX',
			description: ['XXX', 'XXX', 'XXX'],
			data_credit: [
				{
					label: 'XXX',
					links: [
						{
							text: 'XXX',
							url: 'XXX',
						},
					],
				},
			],
			legend: {
				size: 'XXX',
				participants: {
					day: 'XXX',
					week: 'XXX',
					month: 'XXX',
					year: 'XXX',
				},
				zeroOrUnknown: 'XXX',
				color: 'XXX',
				organisations: 'XXX',
				other: 'XXX',
			},
			tooltips: {
				aggregated: ({
					timeUnitLabel,
					timeValue,
					protestCount,
					participantCount,
					orgsCount,
				}: {
					timeUnitLabel: string
					timeValue: string
					protestCount: number
					participantCount: number | undefined
					orgsCount: number
				}) => (
					<>
						XXX <B>{timeValue}</B> XXX{' '}
						<B>{protestCount.toLocaleString('en-GB')} XXX</B>{' '}
						{participantCount && (
							<>
								XXX <B>{participantCount.toLocaleString('en-GB')} XXX</B>
							</>
						)}{' '}
						XXX {orgsCount > 1 ? 'XXX' : 'XXX'} XXX
					</>
				),
			},
		},
		topics_trend: {
			heading: 'XXX',
			description: ['XXX', 'XXX'],
			data_credit: [
				{
					label: 'XXX',
					links: [
						{
							text: 'XXX',
							url: 'XXX',
						},
					],
				},
			],
		},

		topics_impact: {
			heading: 'XXX',
			description: 'XXX',
		},
		sentiment_protest: {
			heading: 'XXX',
			description: ['XXX'],
			data_credit: [
				{
					label: 'XXX',
					links: [
						{
							text: 'XXX',
							url: 'XXX',
						},
					],
				},
			],
		},
		sentiment_protest_impact: {
			heading: 'XXX',
			description: 'XXX',
		},
		sentiment_policy: {
			heading: 'XXX',
			description: ['XXX'],
			data_credit: [
				{
					label: 'XXX',
					links: [
						{
							text: 'XXX',
							url: 'XXX',
						},
					],
				},
			],
		},
		sentiment_policy_impact: {
			heading: 'XXX',
			description: 'XXX',
		},
	},
	organisationsPage: {
		heading: 'XXX',
		description: (props: {
			isSameDay: boolean
			formattedFrom: string
			formattedTo: string
			orgsCount: number
		}) => {
			return `XXX`
		},
		allOrganisations: 'XXX',
		showPartnersAriaLabel: 'XXX',
		propertyNames: {
			name: 'XXX',
			totalEvents: 'XXX',
			totalParticipants: 'XXX',
			avgParticipants: 'XXX',
			totalPartners: 'XXX',
		},
		adBanner: {
			heading: (_props: { organisationNode: ReactNode }) => <>XXX</>,
			description: (_props: { organisationNode: ReactNode }) => <>XXX</>,
			buttons: { contactUs: 'XXX' },
		},
	},
	singleProtestPage: {
		heading: (props: {
			formattedDate: string
			orgsCount: number
			orgName: string
		}) => `XXX`,
		propertyNames: {
			city: 'XXX',
			country: 'XXX',
			organisations: 'XXX',
		},
		table: {
			heading: 'XXX',
			description: 'XXX',
			header: {
				title: 'XXX',
				summary: 'XXX',
				date: 'XXX',
				url: 'XXX',
				sentimentActivism: 'XXX',
				sentimentPolicy: 'XXX',
			},
		},
		charts: {
			heading: 'XXX',
			description: 'XXX',
			sentimentTowards: ({ topicNode }: { topicNode: ReactNode }) => (
				<>XXX {topicNode}</>
			),
		},
	},
	docsPage: {
		documentation: 'XXX',
		nextPage: 'XXX',
		prevPage: 'XXX',
		contents: 'XXX',
		onThisPage: 'XXX',
		tocAriaLabel: 'XXX',
		tocButtonText: 'XXX',
		tocNoContentsFound: 'XXX',
	},
} satisfies typeof textsEnGB

export const texts = textsEnGB
// export const texts = textsXXX;
