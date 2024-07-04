import CommonProviders from "@/commonProviders";
import ThemeToggle from "@/components/ThemeToggle";
import "@/styles/global.css";
import { cn } from "@/utility/classNames";
import { inter, neueRegrade } from "@/utility/fonts";
import type { ReactNode } from "react";

export default function CosmosLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={cn(neueRegrade.variable, inter.variable)}
			suppressHydrationWarning
		>
			<head />
			<body className="bg-grayUltraLight w-screen min-h-screen overflow-x-clip">
				<CommonProviders>
					<div className="fixed top-8 right-8 bg-bg z-10">
						<ThemeToggle />
					</div>
					{children}
				</CommonProviders>
			</body>
		</html>
	);
}
