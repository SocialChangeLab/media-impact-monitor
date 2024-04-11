import { inter, neueRegrade } from '@utility/fonts'
import React from 'react'

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
			data-applied-mode="light"
		>
			<head>
				{/* eslint-disable-next-line @next/next/no-sync-scripts */}
				<script src="/theme.js" type="text/javascript"></script>
			</head>
			<body className="bg-pattern-soft">{children}</body>
		</html>
	)
}
