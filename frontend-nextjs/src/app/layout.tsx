import { inter, neueRegrade } from '@utility/fonts'
import React from 'react'

import { ThemeProvider } from '@providers/ThemeProvider'
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
				<ThemeProvider defaultTheme="system" enableSystem>
					{children}
				</ThemeProvider>
			</body>
		</html>
	)
}
