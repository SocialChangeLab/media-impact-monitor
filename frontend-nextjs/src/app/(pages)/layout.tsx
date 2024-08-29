import Providers from "@/appProviders";
import { BaseLayout } from "@/components/BaseLayout";
import "@/styles/global.css";
import { cn } from "@/utility/classNames";
import { inter, neueRegrade } from "@/utility/fonts";
import { toZonedTime } from "date-fns-tz";
import type { ReactNode } from "react";

export default function RootLayout({
	children,
	modal,
}: Readonly<{
	children: ReactNode;
	modal: ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={cn(neueRegrade.variable, inter.variable)}
			suppressHydrationWarning
		>
			<head />
			<body
				className={cn(
					"bg-pattern-soft min-h-screen !pointer-events-auto",
					"w-screen overflow-x-clip max-w-page mx-auto",
				)}
			>
				<Providers today={toZonedTime(new Date(), "America/New_York")}>
					<BaseLayout modal={modal}>{children}</BaseLayout>
				</Providers>
			</body>
		</html>
	);
}
