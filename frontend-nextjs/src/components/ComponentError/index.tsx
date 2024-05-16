"use client";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function ComponentError({
	errorDetails,
	errorMessage = "There was an unexpected error while fetching the data:",
	reset,
}: {
	errorMessage: string;
	errorDetails?: string;
	reset?: () => void;
}) {
	const pathname = usePathname();
	return (
		<div className="w-fit max-w-96 flex flex-col items-center">
			<div className="mb-6 relative min-w-full flex justify-center">
				<div className="h-px w-full bg-grayLight absolute inset-x-0 top-1/2"></div>
				<div className="text-fg p-4 rounded-full border border-grayLight w-fit bg-grayUltraLight z-10">
					<AlertTriangle
						size={56}
						strokeWidth={1}
						className="-mt-1 text-red-600"
					/>
				</div>
			</div>
			{errorMessage}
			{errorDetails && (
				<pre className="mt-2 min-w-full px-6 py-5 bg-grayDark text-bg mb-6 text-mono max-w-full overflow-x-auto">
					<code>{errorDetails}</code>
				</pre>
			)}
			<div className="flex gap-4 flex-wrap min-w-full justify-between">
				{reset && <Button onClick={reset}>Try again</Button>}
				<Button asChild variant="outline">
					<Link href={pathname}>Reset all filters</Link>
				</Button>
			</div>
		</div>
	);
}

export default ComponentError;
