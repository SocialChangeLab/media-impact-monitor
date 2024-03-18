import { Inter } from 'next/font/google'
import localFont from 'next/font/local'

export const inter = Inter({
	subsets: ['latin'],
	variable: '--font-inter',
})

export const neueRegrade = localFont({
	variable: '--font-neue-regrade',
	src: [
		{
			path: '../assets/font/neue_regrade_bold_italic-webfont.woff2',
			weight: 'bold',
			style: 'italic',
		},
		{
			path: '../assets/font/neue_regrade_bold-webfont.woff2',
			weight: 'bold',
			style: 'normal',
		},
		{
			path: '../assets/font/neue_regrade_medium_italic-webfont.woff2',
			weight: 'normal',
			style: 'italic',
		},
		{
			path: '../assets/font/neue_regrade_medium-webfont.woff2',
			weight: 'normal',
			style: 'normal',
		},
	],
})
