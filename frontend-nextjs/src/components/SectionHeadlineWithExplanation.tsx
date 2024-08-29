import { cn } from "@/utility/classNames";
import { type ReactNode, memo } from "react";
import { ChartDocsDialog } from "./ChartDocsDialog";
import { Dialog } from "./ui/dialog";

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
				!!children && "pb-[max(1.5rem,4vmax)]",
				"border-b border-grayMed last-of-type:border-b-0",
			)}
		>
			<Dialog>
				<div
					className={cn(
						"flex justify-between items-center flex-wrap gap-3",
						!!children && "mb-8",
					)}
				>
					<div className="w-fit flex flex-col ">
						{headline && (
							<H
								className={cn(
									"font-headlines text-2xl lg:text-3xl font-bold",
									"flex items-center mb-3 antialiased gap-2",
									"leading-7 w-[min(40ch,100%)] text-balance",
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
					<ChartDocsDialog helpSlug={helpSlug} />
				</div>
			</Dialog>
			{children && <div className="flex flex-col gap-8">{children}</div>}
		</section>
	);
}

export default memo(SectionHeadlineWithExplanation);
