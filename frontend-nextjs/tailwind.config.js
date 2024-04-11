const plugin = require('tailwindcss/plugin')

const fallbackFonts = [
	'ui-sans-serif',
	'system-ui',
	'-apple-system',
	'BlinkMacSystemFont',
	'Segoe UI',
	'Roboto',
	'Helvetica Neue',
	'Arial',
	'Noto Sans',
	'sans-serif',
	'Apple Color Emoji',
	'Segoe UI Emoji',
	'Segoe UI Symbol',
	'Noto Color Emoji',
]

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class', '[data-applied-mode="dark"]'],
	content: ['./src/**/*.{js,jsx,md,mdx,ts,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				headlines: ['var(--font-neue-regrade)', ...fallbackFonts],
				sans: ['var(--font-inter)', ...fallbackFonts],
				serif: ['serif'],
				mono: ['monospace'],
			},
			colors: {
				brandGreen: 'var(--brandGreen)',
				brandWhite: 'var(--brandWhite)',
				fg: 'var(--fg)',
				bg: 'var(--bg)',
				bgOverlay: 'var(--bgOverlay)',
				alt: 'var(--alt)',
				grayDark: 'var(--grayDark)',
				grayMed: 'var(--grayMed)',
				grayLight: 'var(--grayLight)',
				grayUltraLight: 'var(--grayUltraLight)',
			},
			height: { screen: '100lvh' },
			width: { screen: '100lvw' },
			screens: {
				xs: '400px',
			},
		},
	},
	plugins: [
		require('@tailwindcss/container-queries'),
		require('@tailwindcss/forms'),
		require('@tailwindcss/typography'),
		require('tailwindcss-animate'),
		plugin(function ({ addUtilities }) {
			addUtilities({
				'.text-balance': {
					'text-wrap': 'balance',
				},
				'.text-pretty': {
					'text-wrap': 'pretty',
				},
				'.text-stroke-grayDark': {
					'-webkit-text-stroke-width': '5px',
					'-webkit-text-stroke-color': 'var(--grayDark)',
				},
				'.text-stroke-fg': {
					'-webkit-text-stroke-width': '5px',
					'-webkit-text-stroke-color': 'var(--fg)',
				},
			})
		}),
	],
}
