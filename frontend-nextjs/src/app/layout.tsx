import { DevtoolsProvider } from '@providers/devtools'
import { Refine } from '@refinedev/core'
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar'
import routerProvider from '@refinedev/nextjs-router'
import { inter, neueRegrade } from '@utility/fonts'
import { Metadata } from 'next'
import React, { Suspense } from 'react'

import { dataProvider } from '@providers/data-provider'
import '@styles/global.css'
import { cn } from '@utility/classNames'

export const metadata: Metadata = {
	title: 'Media Impact Monitor',
	description:
		'A novel tool for protest groups and NGOs to measure and visualize their impact on public discourse',
	icons: {
		icon: '/favicon.ico',
	},
}

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
			<body className="bg-pattern-soft">
				<Suspense>
					<RefineKbarProvider>
						<DevtoolsProvider>
							<Refine
								routerProvider={routerProvider}
								dataProvider={dataProvider}
								resources={[
									{
										name: 'blog_posts',
										list: '/blog-posts',
										create: '/blog-posts/create',
										edit: '/blog-posts/edit/:id',
										show: '/blog-posts/show/:id',
										meta: {
											canDelete: true,
										},
									},
									{
										name: 'categories',
										list: '/categories',
										create: '/categories/create',
										edit: '/categories/edit/:id',
										show: '/categories/show/:id',
										meta: {
											canDelete: true,
										},
									},
								]}
								options={{
									syncWithLocation: true,
									warnWhenUnsavedChanges: true,
									useNewQueryKeys: true,
									projectId: '2VQAyu-W2KFUP-84PmiP',
								}}
							>
								{children}
								<RefineKbar />
							</Refine>
						</DevtoolsProvider>
					</RefineKbarProvider>
				</Suspense>
			</body>
		</html>
	)
}
