import Providers from "@/appProviders";
import { BaseLayout } from "@/components/BaseLayout";
import "@/styles/global.css";
import { cn } from "@/utility/classNames";
import { inter, neueRegrade } from "@/utility/fonts";
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
					"bg-pattern-soft min-h-screen",
					"w-screen overflow-x-clip max-w-page 2xl:border-x border-grayLight mx-auto",
				)}
			>
				<Providers>
					<BaseLayout modal={modal}>{children}</BaseLayout>
				</Providers>
			</body>
		</html>
	);
}
