import { cn } from "@/utility/classNames";
import { HelpCircle } from "lucide-react";
import { type ReactNode, memo } from "react";
import HelpDialogContent from "./HelpDialogContent";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

function SectionHeadlineWithExplanation({
	children,
	headline,
	description,
	helpSlug,
	headlineLevel: H = "h2",
}: {
	children: ReactNode;
	headline: ReactNode;
	description?: ReactNode;
	helpSlug?: string;
	headlineLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}) {
	return (
		<section className="px-[max(1rem,2vmax)] pt-[max(1.25rem,2.5vmax)] py-[max(1.5rem,4vmax)] border-b border-grayLight last-of-type:border-b-0">
			<Dialog>
				<div className="flex justify-between items-center mb-6">
					<div className="w-fit flex flex-col mb-2">
						<H
							className={cn(
								"font-headlines text-3xl font-bold",
								"flex items-center mb-1 antialiased gap-2",
							)}
						>
							{headline}
						</H>
						{description && <p className="text-grayDark">{description}</p>}
					</div>
					{helpSlug && (
						<DialogTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="text-grayDark pl-3 pr-1 rounded-full flex gap-2 items-center group"
							>
								<span
									className={cn(
										"underline decoration-grayMed underline-offset-4 transition w-fit",
										"group-hover:decoration-fg group-hover:text-fg text-sm",
									)}
								>
									How to read this
								</span>
								<HelpCircle />
							</Button>
						</DialogTrigger>
					)}
				</div>
				{helpSlug && (
					<DialogContent
						className={cn(
							"border border-grayMed",
							"shadow-lg shadow-black/5 dark:shadow-black/50",
							"w-full max-w-screen-md",
						)}
					>
						<HelpDialogContent slug={helpSlug} />
					</DialogContent>
				)}
			</Dialog>
			<div className="flex flex-col gap-8">{children}</div>
		</section>
	);
}

export default memo(SectionHeadlineWithExplanation);
