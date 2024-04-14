import { inter, neueRegrade } from '@utility/fonts'
import React from 'react'

import { BaseLayout } from '@components/BaseLayout'
import QueryClientProvider from '@components/QueryClientProvider'
import { Toaster } from '@components/ui/sonner'
import { TooltipProvider } from '@components/ui/tooltip'
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
				<QueryClientProvider>
					<ThemeProvider defaultTheme="system" enableSystem>
						<TooltipProvider>
							<BaseLayout>{children}</BaseLayout>
						</TooltipProvider>
					</ThemeProvider>
				</QueryClientProvider>
				<Toaster />
			</body>
		</html>
	)
}
