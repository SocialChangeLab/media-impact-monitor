export function titleCase(str: string) {
	return str.replace(
		/\w\S*/g,
		(txt) => txt.charAt(0).toUpperCase() + txt.substr(1),
	);
}

export const texts = {
	info: {
		welcome_message: {
			heading: "The Impact Monitor Dashboard",
			description: [
				"Welcome to the Impact Monitor Dashboard. Here, you can see protests over time, topics, and sentiments within the media and how protest organisations impact the media landscape.",
				"Start by setting the filters at the top of the page and scroll down to explore the data.",
			],
		},
	},
	charts: {
		protest_timeline: {
			heading: "What protests are happening?",
			description: [
				"See protests over time for all of the selected organisations.",
				"Hover or click on the bubbles for more information on individual protest events.",
				"Currently, we only cover climate protests in Germany since 2020.",
			],
			data_credit: [
				{
					label: "Protest data:",
					credit: "Armed Conflict Location & Event Data Project (ACLED)",
					url: "https://acleddata.com/",
				},
			],
		},
		topics_trend: {
			heading: "What topics are the focus of public discourse?",
			description: [
				"See how many articles are published on various topics over time.",
				"Use the filters to switch between online newspaper articles, print newspaper articles, and queries that people search for on Google.",
			],
			data_credit: [
				{
					label: "Media data:",
					credit: "MediaCloud",
					url: "https://mediacloud.org/",
				},
			],
		},

		topics_impact: {
			heading: "Computed impacts",
			description:
				"See how many additional articles were published on average because of a protest by an organisation.",
			data_credit: [],
		},
		sentiment_protest: {
			heading: "What sentiment does the media show towards the protests?",
			description: [
				"See whether the media's coverage of the protests is more positive, negative, or neutral.",
			],
			data_credit: [
				{
					label: "Media data:",
					credit: "MediaCloud",
					url: "https://mediacloud.org/",
				},
			],
		},
		sentiment_protest_impact: {
			heading: "Computed impacts",
			description: [],
			data_credit: [],
		},
		sentiment_policy: {
			heading:
				"What stance does the media have towards progressive climate policies?",
			description: [
				"See whether the media supports or opposes policies aimed at mitigating climate change.",
			],
			data_credit: [
				{
					label: "Media data:",
					credit: "MediaCloud",
					url: "https://mediacloud.org/",
				},
			],
		},
		sentiment_policy_impact: {
			heading: "Computed impacts",
			description: [],
			data_credit: [],
		},
	},
};
