import Team from "@/components/Team";

export default async function AboutPage() {
	return (
		<>
			<h1 className="text-3xl">About the Media Impact Monitor</h1>
			<p className="lead">
				<em>Media Impact Monitor</em> is a novel tool for protest groups and
				NGOs to measure and visualize their impact on public discourse. The tool
				shows how activist events affect the discourse across various media
				sources, such as local and national newspapers, social media,
				parliamentary debates, and more. Protest groups can use it to
				quantitatively and qualitatively evaluate their actions and adapt them
				in a targeted manner to draw attention to their issues.
			</p>
			<h2 id="background">Background</h2>
			<p>
				NGOs and protest groups often want to draw more public attention to
				important issues in order to initiate social change. To do this, they
				organise panel discussions, publish articles on social media, send out
				press releases, organize demonstrations, practice civil disobedience,
				implement art actions, and so on. To evaluate their work, organizations
				often use &quot;press hits&quot; as a metric - but this is a poor
				substitute for the broader impact on agenda setting within public
				discourse, which the organizations are interested in but cannot easily
				analyze.
			</p>
			<p>
				This impact on agenda setting is difficult to capture statistically
				because of the complex causal relationship between discourse, action
				events, and external events. A correlational and even a simple
				regression analysis would therefore lead to statistically biased
				results.
			</p>
			<p>
				This is where the <em>Media Impact Monitor</em> comes in: It uses
				innovative causal inference methods to quantify and visualize how action
				events affect agenda setting in public discourse.
			</p>
			<p>
				<strong>Examples:</strong> Protest groups such as &quot;Last
				Generation&quot; can use it to see whether their actions distract from
				actual climate policy discussion or contribute to it constructively; and
				NGOs such as Greenpeace can evaluate which of their formats are most
				effective in media terms, and can use their media impact as an argument
				for donating to them.
			</p>
			<h2 id="team">Team</h2>
			<Team />
			<h2 id="contact">Contact</h2>
			<p>
				We are seeking activists and NGO employees to help us shape the tool: We
				are curious about your experience with media evaluation, your ideas and
				dreams, and your feedback on our prototypes!
			</p>
			<p>
				Please <a href="mailto:david@socialchangelab.org">send us an email</a>{" "}
				or{" "}
				<a href="https://cal.com/davidpomerenke/meeting-mim">
					book a short meeting
				</a>{" "}
				with us 🤗
			</p>
		</>
	);
}
