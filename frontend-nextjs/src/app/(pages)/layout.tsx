import { BaseLayout } from "@/components/BaseLayout";
import Providers from "@/provders";
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
			<body className="bg-pattern-soft w-screen overflow-x-clip">
				<Providers>
					<BaseLayout modal={modal}>{children}</BaseLayout>
				</Providers>
			</body>
		</html>
	);
}
