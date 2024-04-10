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
				<script
					dangerouslySetInnerHTML={{
						__html: `
              function loadUserPrefTheme() {
                const userPref = localStorage.getItem('theme')
                const userPreference =
                  userPref ||
                  (matchMedia('(prefers-color-scheme: dark)').matches
                    ? 'dark'
                    : 'light')
                document.documentElement.dataset.appliedMode = userPreference
                userPref && localStorage.setItem('theme', userPreference)
              }
              loadUserPrefTheme()`,
					}}
				></script>
			</head>
			<body className="bg-pattern-soft">{children}</body>
		</html>
	)
}
