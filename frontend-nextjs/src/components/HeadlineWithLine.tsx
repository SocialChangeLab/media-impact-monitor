import type { ElementType, ReactNode } from "react";

function HeadlineWithLine({
	children,
	as: Tag = "h4",
}: {
	children: ReactNode;
	as?: ElementType;
}) {
	return (
		<Tag className="w-full flex text-lg font-bold font-headlines antialiased relative z-10">
			<span className="w-fit pr-4 bg-pattern-soft relative z-20 inline-flex gap-2 items-baseline">
				{children}
			</span>
			<span className="h-px w-full bg-grayLight absolute top-1/2 left-0 z-10"></span>
		</Tag>
	);
}

export default HeadlineWithLine;
