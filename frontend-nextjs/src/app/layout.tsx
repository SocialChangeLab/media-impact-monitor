import { inter, neueRegrade } from "@/utility/fonts";
import type React from "react";

import { BaseLayout } from "@/components/BaseLayout";
import Providers from "@/provders";
import "@/styles/global.css";
import { cn } from "@/utility/classNames";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={cn(neueRegrade.variable, inter.variable)}
			suppressHydrationWarning
		>
			<head />
			<body className="bg-pattern-soft w-screen overflow-x-clip">
				<Providers>
					<BaseLayout>{children}</BaseLayout>
				</Providers>
			</body>
		</html>
	);
}
