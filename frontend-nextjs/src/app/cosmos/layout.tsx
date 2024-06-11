import Providers from "@/provders";
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
			<body className="bg-pattern-soft w-screen overflow-x-clip">
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
