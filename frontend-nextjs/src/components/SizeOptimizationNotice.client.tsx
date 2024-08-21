"use client";
import { cn } from "@/utility/classNames";
import { motion } from "framer-motion";
import { Monitor, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";

type HelpBannerActions = {
	onHide: () => void;
};

function SizeOptimizationNotice({ onHide }: HelpBannerActions) {
	return (
		<Alert className="relative grid grid-cols-[auto,1fr] gap-x-2 pr-10 h-32 bg-grayUltraLight mix-blend-multiply dark:mix-blend-screen">
			<Monitor className="size-6 -translate-x-1" />
			<AlertTitle className="flex h-full items-center">Heads up!</AlertTitle>
			<span />
			<AlertDescription>
				This dashboard is not optimized for smaller screen.{" "}
				<br className="hidden sm:inline" />
				For a better experience, we recommend using a larger screen.
			</AlertDescription>
			<Button
				size="icon"
				className="absolute right-1 top-1 rounded-full"
				variant="ghost"
				onClick={onHide}
			>
				<X className="size-5" />
			</Button>
		</Alert>
	);
}

function DashboardHelpBannerClient({
	defaultIsDisplayed = true,
	persistIsDisplayed = () => {},
}: {
	defaultIsDisplayed?: boolean | undefined;
	persistIsDisplayed?: (value: boolean) => void;
}) {
	const [isDisplayed, setIsDisplayed] = useState(defaultIsDisplayed);

	const setIsDisplayedValue = useCallback(
		(value: boolean) => {
			setIsDisplayed(value);
			persistIsDisplayed(value);
		},
		[persistIsDisplayed],
	);

	const actions = useMemo(
		() => ({
			onExpand: () => setIsDisplayedValue(true),
			onHide: () => setIsDisplayedValue(false),
		}),
		[setIsDisplayedValue],
	);

	return (
		<motion.section
			variants={{
				collapsed: {
					height: `0`,
					paddingTop: `0`,
					paddingBottom: `0`,
				},
				expanded: {
					height: `10rem`,
					paddingTop: `4rem`,
					paddingBottom: `4rem`,
				},
			}}
			initial={isDisplayed ? "expanded" : "collapsed"}
			animate={isDisplayed ? "expanded" : "collapsed"}
			className={cn(
				"px-[var(--pagePadding)] overflow-clip flex flex-col justify-center",
				"border-b border-grayLight last-of-type:border-b-0 lg:hidden",
			)}
		>
			{isDisplayed && <SizeOptimizationNotice {...actions} />}
		</motion.section>
	);
}

export default DashboardHelpBannerClient;
