import { IconBadge } from "./icon-badge";
const Icon = () => (
	// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
	<svg
		width={20}
		height={20}
		viewBox="0 0 24 24"
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
		<div className="border border-dashed border-grayLight p-8 rounded-lg bg-pattern-soft flex gap-8">
			<IconBadge icon={<Icon />} label="Default" />
		</div>
	</div>
);
