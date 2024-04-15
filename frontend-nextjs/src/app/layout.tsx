import { inter, neueRegrade } from '@utility/fonts'
import React from 'react'

import { BaseLayout } from '@components/BaseLayout'
import Providers from '@provders'
import '@styles/global.css'
import { cn } from '@utility/classNames'

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html
			lang="en"
			className={cn(neueRegrade.variable, inter.variable)}
			suppressHydrationWarning
		>
			<head></head>
			<body className="bg-pattern-soft">
				<Providers>
					<BaseLayout>{children}</BaseLayout>
				</Providers>
			</body>
		</html>
	)
}
