"use client";
import { Button } from "@/components/ui/button";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { cn } from "@/utility/classNames";
import { texts } from "@/utility/textUtil";
import { X } from "lucide-react";

export type ComponentErrorProps = {
	errorMessage: string;
	errorDetails?: string;
	reset?: () => void;
};

function ComponentError({
	errorDetails,
	errorMessage = texts.errors.apiErrorTranslations.defaultMessage(),
	reset,
}: ComponentErrorProps) {
	const { from, to, resetAllFilters } = useFiltersStore(
		({ from, to, resetAllFilters }) => ({
			from,
			to,
			resetAllFilters,
		}),
	);
	return (
		<div className="w-fit max-w-96 flex flex-col">
			<div className={cn("mb-3 w-fit h-fit")}>
				<X size={48} strokeWidth={1} className="text-red-600 -ml-3" />
			</div>
			<div className="mb-3 relative min-w-full grid grid-cols-[auto,1fr] items-center gap-4">
				<strong className="font-semibold">{texts.errors.heading}</strong>
				<div className="h-px w-full bg-grayLight"></div>
			</div>
			<div className="">
				<p className="text-grayDark">{errorMessage}</p>
				{errorDetails && (
					<pre
						className={cn(
							"min-w-full px-6 py-5 bg-grayDark mt-2",
							"dark:bg-bg dark:text-fg dark:border dark:border-grayLight",
							"text-mono text-bg max-w-full overflow-x-auto",
						)}
					>
						<code>{errorDetails}</code>
					</pre>
				)}
				<div className="flex gap-4 flex-wrap min-w-full justify-between pt-6">
					{reset && (
						<Button size="sm" onClick={reset}>
							{texts.errors.buttons.tryAgain}
						</Button>
					)}
					{from && to && (
						<Button onClick={resetAllFilters} variant="outline" size="sm">
							{texts.errors.buttons.resetFilters}
						</Button>
					)}
				</div>{" "}
			</div>
		</div>
	);
}

export default ComponentError;
