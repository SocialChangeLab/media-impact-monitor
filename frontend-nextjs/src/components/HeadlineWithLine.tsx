function HeadlineWithLine({
	children,
	as: Tag = "h4",
}: {
	children: React.ReactNode;
	as?: React.ElementType;
}) {
	return (
		<Tag className="text-lg font-bold font-headlines antialiased relative z-10">
			<span className="w-fit pr-4 bg-pattern-soft relative z-20">
				{children}
			</span>
			<span className="h-px w-full bg-grayLight absolute top-1/2 left-0 z-10"></span>
		</Tag>
	);
}

export default HeadlineWithLine;
