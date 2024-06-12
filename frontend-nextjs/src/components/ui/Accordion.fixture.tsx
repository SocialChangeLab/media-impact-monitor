"use client";

import { Apple, Banana, Cherry } from "lucide-react";
import { useState } from "react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "./accordion";

const accordionItems = [
	{
		value: "apples",
		Icon: Apple,
		title: "Fun facts about apples",
		funFacts: [
			"Variety of Varieties: There are over 7,500 different types of apples grown around the world, each with its own unique flavor, texture, and color.",
			"Applegrowing and Ancient History: Apples have been cultivated for thousands of years. The ancient Greeks and Romans were some of the first to grow apple orchards.",
			"Apples and Science: The scientific name for the apple is Malus domestica, and interestingly, they belong to the rose family, Rosaceae, which also includes pears, peaches, plums, and cherries.",
		],
	},
	{
		value: "bananas",
		Icon: Banana,
		title: "Fun facts about bananas",
		funFacts: [
			"Banana Variety: There are over 1,000 different types of bananas grown globally, but the Cavendish variety is the most commonly consumed in many parts of the world.",
			"Natural Radioactivity: Bananas contain a small amount of radioactive potassium-40, but it's perfectly safe to eat and contributes to our daily potassium intake.",
			"World's Berry: Despite their appearance, bananas are botanically classified as berries. The banana plant itself is actually considered an herb, not a tree.",
		],
	},
	{
		value: "cherries",
		Icon: Cherry,
		title: "Fun facts about cherries",
		funFacts: [
			"Cherry Varieties: There are more than 1,000 varieties of cherries, but only about 20 are commercially grown for consumption.",
			"Ancient History: Cherries have been enjoyed since prehistoric times, with evidence suggesting that early humans in Europe and Asia ate wild cherries more than 5,000 years ago.",
			"Short Growing Season: Cherries have a very short growing season and are typically harvested in late spring to early summer, making them a beloved but fleeting seasonal treat.",
		],
	},
];

export default function AccordionFixture() {
	const [accordionItem, setAccordionItem] = useState("item-1");
	return (
		<div className="w-screen h-screen relative flex justify-center items-center p-8">
			<div className="border border-dashed border-grayLight p-8 pt-4 rounded-lg bg-pattern-soft w-full max-w-screen-sm">
				<Accordion
					type="single"
					collapsible
					className="border-b-0"
					value={accordionItem}
					onValueChange={setAccordionItem}
				>
					{accordionItems.map(({ value, title, Icon, funFacts }) => (
						<AccordionItem value={value} key={value}>
							<AccordionTrigger>
								<span className="grid grid-cols-[auto_1fr] gap-2 items-center">
									<Icon size="1.25rem" />
									{title}
								</span>
							</AccordionTrigger>
							<AccordionContent>
								<div className="flex flex-col gap-4">
									{funFacts.map((text) => (
										<p key={text}>{text}</p>
									))}
								</div>
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</div>
	);
}
