import { cn } from "@/utility/classNames";
import { Info } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

function SectionHeadlineWithExplanation({
	children,
	headline,
	description,
	additionalUi,
	help,
	headlineLevel: H = "h2",
}: {
	children: ReactNode;
	headline: ReactNode;
	description?: ReactNode;
	additionalUi?: ReactNode;
	help?: ReactNode;
	headlineLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}) {
	return (
		<section className="px-[max(1rem,2vmax)] pt-[max(1.25rem,2.5vmax)] py-[max(1.5rem,4vmax)] border-b border-grayLight last-of-type:border-b-0">
			<div className="flex justify-between items-center mb-6">
				<div className="w-fit flex flex-col mb-2">
					<H
						className={cn(
							"font-headlines text-3xl font-bold",
							"flex items-center mb-1 antialiased gap-2",
						)}
					>
						{headline}
						{help && (
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="ghost"
										size="sm"
										className="text-grayDark px-1 rounded-full"
									>
										<Info />
									</Button>
								</PopoverTrigger>
								<PopoverContent>{help}</PopoverContent>
							</Popover>
						)}
					</H>
					{description && <p className="text-grayDark">{description}</p>}
				</div>
				{additionalUi}
			</div>
			<div className="flex flex-col gap-8">{children}</div>
		</section>
	);
}

export default SectionHeadlineWithExplanation;
