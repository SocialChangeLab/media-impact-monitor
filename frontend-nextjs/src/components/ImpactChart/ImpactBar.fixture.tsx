import ImpactBar from "./ImpactBar";

function ImpactBarFixture() {
	return (
		<div className="w-full h-full min-h-screen relative flex justify-center items-center p-8">
			<div className="border border-dashed border-grayLight p-8 pt-6 rounded-lg bg-pattern-soft grid grid-cols-5 gap-8 w-full max-w-screen-sm group">
				<ImpactBar
					impact={0.2}
					color="var(--categorical-color-1)"
					uncertainy={0.5}
					uniqueId="impact-bar-1"
				/>
				<ImpactBar
					impact={0.3}
					color="var(--categorical-color-2)"
					uncertainy={0.3}
					uniqueId="impact-bar-2"
				/>
				<ImpactBar
					impact={0.5}
					color="var(--categorical-color-3)"
					uncertainy={null}
					uniqueId="impact-bar-3"
				/>
				<ImpactBar
					impact={1}
					color="var(--categorical-color-4)"
					uncertainy={0.1}
					uniqueId="impact-bar-4"
				/>
				<ImpactBar
					impact={0.8}
					color="var(--categorical-color-5)"
					uncertainy={0.2}
					uniqueId="impact-bar-5"
				/>
			</div>
		</div>
	);
}

export default ImpactBarFixture;
