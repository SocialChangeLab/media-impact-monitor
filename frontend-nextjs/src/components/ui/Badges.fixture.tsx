import { Badge } from "./badge";

export default () => (
	<div className="w-full h-full min-h-screen relative flex justify-center items-center p-8">
		<div className="border border-dashed border-grayLight p-8 rounded-lg bg-pattern-soft flex gap-8">
			<Badge variant="default">Default</Badge>
			<Badge variant="secondary">Secondary</Badge>
			<Badge variant="outline">Outline</Badge>
		</div>
	</div>
);
