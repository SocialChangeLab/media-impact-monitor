import Team from '@/components/Team'
import { texts } from '@/utility/textUtil'

export const metadata = {
	title: `${texts.mainNavigation.about} | ${texts.seo.siteTitle}`,
}

export default async function AboutPage() {
	return (
		<>
			<h1 className="text-3xl">About the Media Impact Monitor</h1>
			<p className="lead">
				<em>Media Impact Monitor</em> makes you explore the world of protest and
				activism, and the impact that it has on societal discourse. Activists
				want to change the world – whether it is about climate change
				mitigation, animal welfare, human rights, or any other important topic –
				but it is hard to measure how successful they are at it.{' '}
				<em>Media Impact Monitor</em> takes all the data that is available,
				visualizes it, and makes statistical estimates of how successful
				different groups and different protest types are at creating attention
				and support for the cause that they care about.
			</p>
			<h2 id="background">Features and Background</h2>
			<ul>
				<li>
					<strong>Explore what protests are happening.</strong> We visualize all
					protests that are happening, and you can filter by time range,
					geographic area, and the topics and organizations that you are
					interested in. Currently we focus on climate protests in Germany, with
					plans to expand to more topics and countries.
				</li>
				<li>
					<strong>Analyze the coverage of specific protest events.</strong> Find
					the events that you have attended or organized, and see how newspapers
					have reported about them. We find all articles about your event,
					analyze their sentiment towards the protest, as well as the support
					for the cause that you pursue.
				</li>
				<li>
					<strong>Understand trends in societal discourse.</strong> The{' '}
					<em>theory of change</em> of how most protests achieve an impact is:
					via media attention, societal discourse, popular opinion, and
					eventually policy change. Not everything can be quantified, but some
					things can. We collect data and analyze it with regard to your protest
					and your cause, from:
					<ul>
						<li>online newspapers</li>
						<li>
							print newspapers <i>(fulltexts still in todo)</i>
						</li>
						<li>
							trends on Google and Wikipedia <i>(wikipedia still todo)</i>
						</li>
						<li>
							social media <i>(todo)</i>
						</li>
						<li>
							parliamentary debates <i>(todo)</i>
						</li>
						<li>
							political processes <i>(todo)</i>
						</li>
						<li>
							social surveys <i>(todo)</i>
						</li>
					</ul>
				</li>
				<li>
					<strong>
						Quantify the impact of activism <i>(in progress)</i>.
					</strong>{' '}
					Activists often count the amount of coverage about themselves, but
					that is a mediocre metric for measuring success. We use rigorous
					statistics from causal inference to estimate the impact of protests on
					general trends in attention and support for the{' '}
					<em>area of concern</em> of the protests. For example, how much more
					is climate policy discussed in newspapers, due to the protests? You
					can compare the impact of different organizations, and the impact of
					moderate and radical protest tactics. And since statistics is somewhat
					complicated, we explain our methods and show intermediate steps.
				</li>
				<li>
					<strong>
						Keep track of your organization <i>(todo)</i>.
					</strong>{' '}
					If you&apos;re part of an organization and want to measure your media
					impact, then we can collect data and compute statistics just for your
					organization. You can have your own dashboard with your own events,
					and see your impact on all the media sources that we monitor, or on
					your own outcome metrics. We collect citations from politicians and
					journalists about your work, and provide transparent estimates of your
					reach. Share your dashboard with your members and supporters to
					motivate them to donate and take action.
				</li>
			</ul>
			<h2 id="team">Team</h2>
			<Team />
			<h2 id="contact">Contact</h2>
			<p>
				We are seeking activists and NGO employees to help us shape the tool: We
				are curious about your experience with media evaluation, your ideas and
				dreams, and your feedback on our prototypes!
			</p>
			<p>
				Please <a href="mailto:david@socialchangelab.org">send us an email</a>{' '}
				or{' '}
				<a href="https://cal.com/davidpomerenke/meeting-mim">
					book a short meeting
				</a>{' '}
				with us 🤗
			</p>
		</>
	)
}
