"use client";
import Logo from "@/components/logos/AppLogo";
import { cn } from "@/utility/classNames";
import { useState } from "react";
import { moduleWrappers } from "../../../cosmos.imports";

function CosmosIndex() {
	const components = Object.entries(moduleWrappers.fixtures).map(
		([name, wrapper]) => ({
			name: name.match(/\/(\w+)\.fixture\.tsx/)?.[1],
			Component: wrapper.module.default,
		}),
	);
	const [selected, setSelected] = useState<(typeof components)[0]>(
		components[0],
	);
	return (
		<div className="grid grid-cols-[auto_1fr]">
			<aside className="p-6 border-r border-grayLight min-h-screen">
				<nav>
					<Logo className="w-64" />
					<h1 className="text-3xl mt-2">UI Library</h1>
					<h2 className="mt-8 font-bold text-xl pb-1 border-b border-grayLight mb-4">
						Components
					</h2>
					<ul className="mt-2 flex flex-col gap-1">
						{components.map((component) => (
							<li key={component.name}>
								<button
									type="button"
									className={cn(
										"text-grayDark transition-colors px-1 py-0.5",
										selected.name === component.name
											? "text-bg bg-fg font-bold"
											: "hover:text-fg",
									)}
									onClick={() => setSelected(component)}
								>
									{component.name}
								</button>
							</li>
						))}
					</ul>
				</nav>
			</aside>
			<main className="h-full flex justify-center items-center">
				{selected.Component && <selected.Component />}
			</main>
		</div>
	);
}

export default CosmosIndex;
