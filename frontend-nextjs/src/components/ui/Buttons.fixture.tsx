import { Button } from "./button";

const Icon = () => (
	// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
	<svg
		width={24}
		height={24}
		fill="none"
		stroke="currentColor"
		strokeWidth={2}
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<circle cx={12} cy={13} r={8} />
		<path d="M12 9v4l2 2M5 3 2 6M22 6l-3-3M6.38 18.7 4 21M17.64 18.67 20 21" />
	</svg>
);

export default () => (
	<div className="w-full h-full min-h-screen relative flex justify-center items-center p-8">
		<div className="border border-dashed border-grayLight p-8 rounded-lg bg-pattern-soft grid grid-cols-4 gap-8">
			<Button variant="default" size="lg">
				Default large
			</Button>
			<Button variant="outline" size="lg">
				Outline large
			</Button>
			<Button variant="ghost" size="lg">
				Ghost large
			</Button>
			<Button variant="link" size="lg">
				Link large
			</Button>
			<Button variant="default">Default</Button>
			<Button variant="outline">Outline</Button>
			<Button variant="ghost">Ghost</Button>
			<Button variant="link">Link</Button>
			<Button variant="default" size="sm">
				Default small
			</Button>
			<Button variant="outline" size="sm">
				Outline small
			</Button>
			<Button variant="ghost" size="sm">
				Ghost small
			</Button>
			<Button variant="link" size="sm">
				Link small
			</Button>
			<Button variant="default" size="icon">
				<Icon />
			</Button>
			<Button variant="outline" size="icon">
				<Icon />
			</Button>
			<Button variant="ghost" size="icon">
				<Icon />
			</Button>
			<Button variant="link" size="icon">
				<Icon />
			</Button>
		</div>
	</div>
);
