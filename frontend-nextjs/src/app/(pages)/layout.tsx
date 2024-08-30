import Providers from "@/appProviders";
import ogImage from "@/assets/images/og-image.webp";
import { BaseLayout } from "@/components/BaseLayout";
import "@/styles/global.css";
import { cn } from "@/utility/classNames";
import { inter, neueRegrade } from "@/utility/fonts";
import { texts } from "@/utility/textUtil";
import { toZonedTime } from "date-fns-tz";
import type { ReactNode } from "react";

export default function RootLayout({
	children,
	modal,
}: Readonly<{
	children: ReactNode;
	modal: ReactNode;
}>) {
	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://mediaimpactmonitor.app`;
	const ogImageWithUrl = `${siteUrl}/${ogImage.src}`;
	return (
		<html
			lang={texts.language}
			className={cn(neueRegrade.variable, inter.variable)}
			suppressHydrationWarning
		>
			<head>
				<meta charSet="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />

				{/* Meta Description */}
				<meta name="description" content={texts.seo.siteDescription} />

				{/* Open Graph Meta Tags */}
				<meta property="og:title" content={texts.seo.siteTitle} />
				<meta property="og:description" content={texts.seo.siteDescription} />
				<meta property="og:image" content={ogImageWithUrl} />
				<meta property="og:url" content={siteUrl} />
				<meta property="og:type" content="website" />

				{/* Twitter Card Meta Tags */}
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content={texts.seo.siteTitle} />
				<meta name="twitter:description" content={texts.seo.siteDescription} />
				<meta name="twitter:image" content={ogImageWithUrl} />
				<meta name="twitter:url" content={siteUrl} />

				{/* Favicon */}
				<link rel="icon" href={`${siteUrl}/favicon.svg`} type="image/x-icon" />

				{/* Canonical Link */}
				<link rel="canonical" href={siteUrl} />
			</head>
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
