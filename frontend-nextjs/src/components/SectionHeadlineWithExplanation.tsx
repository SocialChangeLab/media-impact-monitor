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
	children?: ReactNode;
	headline?: ReactNode;
	description?: ReactNode;
	helpSlug?: string;
	headlineLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}) {
	return (
		<section
			className={cn(
				"px-[var(--pagePadding)] py-[max(1.25rem,2.5vmax)]",
				children && "pb-[max(1.5rem,4vmax)]",
				"border-b border-grayMed last-of-type:border-b-0",
			)}
		>
			<Dialog>
				<div
					className={cn(
						"flex justify-between items-center flex-wrap gap-3",
						children && "mb-8",
					)}
				>
					<div className="w-fit flex flex-col ">
						{headline && (
							<H
								className={cn(
									"font-headlines text-2xl lg:text-3xl font-bold",
									"flex items-center mb-3 antialiased gap-2",
									"leading-7",
								)}
							>
								{headline}
							</H>
						)}
						{!!description && typeof description === "string" && (
							<p className="text-sm lg:text-base text-grayDark max-w-prose text-pretty">
								{description}
							</p>
						)}
						{!!description && typeof description !== "string" && (
							<div className="text-sm lg:text-base text-grayDark max-w-prose flex flex-col gap-2">
								{description}
							</div>
						)}
					</div>
					{helpSlug && (
						<DialogTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="text-grayDark pl-3 pr-1 rounded-full flex gap-2 items-center group -ml-3 md:ml-0"
							>
								<span
									className={cn(
										"underline decoration-grayMed underline-offset-4 transition w-fit",
										"group-hover:decoration-fg group-hover:text-fg text-sm",
									)}
								>
									How to read this
								</span>
								<HelpCircle className="size-5 lg:size-6" />
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
			{children && <div className="flex flex-col gap-8">{children}</div>}
		</section>
	);
}

export default memo(SectionHeadlineWithExplanation);
