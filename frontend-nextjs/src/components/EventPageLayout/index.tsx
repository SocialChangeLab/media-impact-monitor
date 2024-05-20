function EventPageLayout({
	children,
	calendar,
}: { children: React.ReactNode; calendar: React.ReactNode }) {
	return (
		<div className="px-6 pt-8 pb-16">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold font-headlines antialiased">
					{"Events"}
				</h1>
				{calendar}
			</div>
			<div className="flex flex-col gap-8">{children}</div>
		</div>
	);
}

export default EventPageLayout;
