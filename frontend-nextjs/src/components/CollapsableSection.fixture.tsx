"use client";
import CollapsableSection from "./CollapsableSection";

export default function CollapsableSectionFixture() {
	return (
		<div className="w-screen h-screen relative flex justify-center items-center p-8">
			<div className="border border-dashed border-grayLight p-8 rounded-lg bg-pattern-soft w-full max-w-screen-sm">
				<CollapsableSection
					storageKey="CollapsableSectionFixture"
					title="This is a collapsable section"
					storageType="session"
				>
					Elit cupidatat exercitation do nulla do anim anim voluptate laborum
					aliqua nulla veniam ex veniam Lorem. Aliquip nulla anim labore sit
					labore adipisicing exercitation incididunt. Tempor officia pariatur do
					eiusmod sunt eu dolore officia commodo magna.
				</CollapsableSection>
			</div>
		</div>
	);
}
