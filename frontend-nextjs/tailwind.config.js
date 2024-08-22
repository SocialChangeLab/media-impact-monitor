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
	darkMode: ['class', '[data-theme="dark"]'],
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
				sentimentPositive: 'var(--sentiment-positive)',
				sentimentNegative: 'var(--sentiment-negative)',
				sentimentNeutral: 'var(--sentiment-neutral)',
			},
			height: { screen: '100lvh' },
			width: { screen: '100lvw' },
			screens: {
				xs: '400px',
				maxPage: '1920px',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
			transitionTimingFunction: {
				'smooth-out': 'cubic-bezier(0,.99,0,1)',
				'smooth-in-out': 'cubic-bezier(.33,.38,0,1)',
			},
		},
	},
	plugins: [
		require('@tailwindcss/container-queries'),
		require('@tailwindcss/forms'),
		require('@tailwindcss/typography'),
		require('tailwindcss-animate'),
		plugin(({ addUtilities, addVariant }) => {
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
			addVariant('touch', '.touch &')
		}),
	],
}
