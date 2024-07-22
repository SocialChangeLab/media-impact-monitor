"use client";
import { Button } from "@/components/ui/button";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { cn } from "@/utility/classNames";
import { AlertTriangle } from "lucide-react";

export type ComponentErrorProps = {
	errorMessage: string;
	errorDetails?: string;
	reset?: () => void;
};

function ComponentError({
	errorDetails,
	errorMessage = "There was an unexpected error while fetching the data:",
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
		<div className="w-fit max-w-96 flex flex-col items-center">
			<div className="mb-6 relative min-w-full flex justify-center">
				<div className="h-px w-full bg-grayLight absolute inset-x-0 top-1/2"></div>
				<div
					className={cn(
						"text-fg p-4 rounded-full border border-grayLight",
						"w-fit bg-bg dark:bg-red-600 dark:border-red-600 z-10",
					)}
				>
					<AlertTriangle
						size={56}
						strokeWidth={1}
						className="-mt-1 text-red-600 dark:text-white"
					/>
				</div>
			</div>
			{errorMessage}
			{errorDetails && (
				<pre
					className={cn(
						"mt-2 min-w-full px-6 py-5 bg-grayDark",
						"dark:bg-bg dark:text-fg dark:border dark:border-grayLight",
						"text-mono text-bg max-w-full overflow-x-auto",
					)}
				>
					<code>{errorDetails}</code>
				</pre>
			)}
			<div className="flex gap-4 flex-wrap min-w-full justify-between pt-6">
				{reset && <Button onClick={reset}>Try again</Button>}
				{from && to && (
					<Button onClick={resetAllFilters} variant="outline">
						Reset all filters
					</Button>
				)}
			</div>
		</div>
	);
}

export default ComponentError;
