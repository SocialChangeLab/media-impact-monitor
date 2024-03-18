'use client'
import { cn } from '@utility/classNames'
import { useCallback, useEffect, useState } from 'react'
import styles from './ThemeToggle.module.css'

function ThemeToggle() {
	const [theme, setTheme] = useState('light')

	useEffect(() => {
		const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)')
		const initialTheme = localStorage.getItem('theme')
		const systemTheme = darkModePreference.matches ? 'dark' : 'light'
		const finalTheme = initialTheme || systemTheme

		setTheme(finalTheme)
	}, [])

	const onThemeChange = useCallback((newTheme: 'light' | 'dark') => {
		setTheme(() => newTheme)
		document.documentElement.dataset.appliedMode = newTheme
		localStorage.setItem('theme', newTheme)
	}, [])

	return (
		<button
			id="theme-toggle"
			className={cn(
				`theme-toggle inline-flex w-10 h-10 items-center justify-center`,
				`focus-visible:ring-2 focus-visible:ring-fg outline-none text-grayDark`,
				`focus-visible:rounded-full hover:bg-alt motion-safe:transition-colors`,
				`hover:bg-grayUltraLight hover:text-fg border border-transparent`,
				`hover:border-grayLight`,
				styles.toggle,
			)}
			title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
			role="switch"
			aria-checked={theme === 'light' ? 'false' : 'true'}
			onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				aria-hidden="true"
				className={cn('theme-toggle__within', styles.toggleWithin)}
				height="1.5rem"
				width="1.5rem"
				viewBox="0 0 32 32"
				fill="currentColor"
			>
				<clipPath id="theme-toggle__within__clip">
					<path d="M0 0h32v32h-32ZM6 16A1 1 0 0026 16 1 1 0 006 16"></path>
				</clipPath>
				<g clipPath="url(#theme-toggle__within__clip)">
					<path d="M30.7 21.3 27.1 16l3.7-5.3c.4-.5.1-1.3-.6-1.4l-6.3-1.1-1.1-6.3c-.1-.6-.8-.9-1.4-.6L16 5l-5.4-3.7c-.5-.4-1.3-.1-1.4.6l-1 6.3-6.4 1.1c-.6.1-.9.9-.6 1.3L4.9 16l-3.7 5.3c-.4.5-.1 1.3.6 1.4l6.3 1.1 1.1 6.3c.1.6.8.9 1.4.6l5.3-3.7 5.3 3.7c.5.4 1.3.1 1.4-.6l1.1-6.3 6.3-1.1c.8-.1 1.1-.8.7-1.4zM16 25.1c-5.1 0-9.1-4.1-9.1-9.1 0-5.1 4.1-9.1 9.1-9.1s9.1 4.1 9.1 9.1c0 5.1-4 9.1-9.1 9.1z"></path>
				</g>
				<path
					className={cn(
						'theme-toggle__within__circle',
						styles.toggleWithinCircle,
					)}
					d="M16 7.7c-4.6 0-8.2 3.7-8.2 8.2s3.6 8.4 8.2 8.4 8.2-3.7 8.2-8.2-3.6-8.4-8.2-8.4zm0 14.4c-3.4 0-6.1-2.9-6.1-6.2s2.7-6.1 6.1-6.1c3.4 0 6.1 2.9 6.1 6.2s-2.7 6.1-6.1 6.1z"
				></path>
				<path
					className={cn(
						'theme-toggle__within__inner',
						styles.toggleWithinInner,
					)}
					d="M16 9.5c-3.6 0-6.4 2.9-6.4 6.4s2.8 6.5 6.4 6.5 6.4-2.9 6.4-6.4-2.8-6.5-6.4-6.5z"
				></path>
			</svg>
		</button>
	)
}

export default ThemeToggle
