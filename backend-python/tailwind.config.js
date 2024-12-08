const fallbackFonts = [
	"ui-sans-serif",
	"system-ui",
	"-apple-system",
	"BlinkMacSystemFont",
	"Segoe UI",
	"Roboto",
	"Helvetica Neue",
	"Arial",
	"Noto Sans",
	"sans-serif",
	"Apple Color Emoji",
	"Segoe UI Emoji",
	"Segoe UI Symbol",
	"Noto Color Emoji",
];

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./media_impact_monitor/templates/**/*.html",
		"./media_impact_monitor/static/**/*.js",
	],
	theme: {
		extend: {
			fontFamily: {
				headlines: ["Neue Regrade", ...fallbackFonts],
				sans: ["Inter", ...fallbackFonts],
				serif: ["serif"],
				mono: ["monospace"],
			},
			colors: {
				brandGreen: "var(--brandGreen)",
				brandWhite: "var(--brandWhite)",
				fg: "var(--fg)",
				bg: "var(--bg)",
				bgOverlay: "var(--bgOverlay)",
				alt: "var(--alt)",
				grayDark: "var(--grayDark)",
				grayMed: "var(--grayMed)",
				grayLight: "var(--grayLight)",
				grayUltraLight: "var(--grayUltraLight)",
			},
		},
	},
	plugins: [
		require("@tailwindcss/typography"),
		require("@tailwindcss/forms"),
		require("@tailwindcss/container-queries"),
	],
};
