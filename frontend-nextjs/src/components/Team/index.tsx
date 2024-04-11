import portraitDavid from '@images/portrait-david.jpeg'
import portraitLennart from '@images/portrait-lennart.png'
import portraitLucas from '@images/portrait-lucas.png'
import Image from 'next/image'

const team = [
	{
		image: portraitDavid,
		name: 'David Pomerenke',
		title: 'Data Science',
		bio: 'M.A. Artificial Intelligence',
		tags: ['causal inference'],
	},
	{
		image: portraitLennart,
		name: 'Lennart Klein',
		title: 'Data Science',
		bio: 'B.A. Political Science',
		tags: ['rstats'],
	},
	{
		image: portraitLucas,
		name: 'Lucas Vogel',
		title: 'Frontend UI/UX & Development',
		bio: 'B.A. Interface Design',
		tags: [],
	},
]

function Team() {
	return (
		<ul className="not-prose flex flex-col sm:grid sm:grid-cols-3 gap-4">
			{team.map(({ image, name, title, bio, tags }) => (
				<li className="flex flex-col gap-1" key={name}>
					<picture className="w-24 h-24 relative rounded-full overflow-clip mb-2">
						<Image
							src={image}
							width={96}
							height={96}
							alt={`Portrait of ${name}`}
						/>
						<div
							aria-hidden="true"
							className="absolute inset-0 bg-fg dark:bg-alt opacity-100 mix-blend-lighten"
						></div>
					</picture>
					<h3 className="font-bold text-xl font-headlines antialiased">
						{name}
					</h3>
					<p className="leading-tight mb-1">
						{title}
						<br />
						{bio}
					</p>
					{tags.map((tag) => (
						<small
							className="w-fit px-1.5 py-0.5 bg-grayUltraLight text-fg rounded-sm"
							key={tag}
						>
							{tag}
						</small>
					))}
				</li>
			))}
		</ul>
	)
}

export default Team
