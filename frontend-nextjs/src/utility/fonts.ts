import localFont from "next/font/local";

export const neueRegrade = localFont({
	variable: "--font-neue-regrade",
	src: [
		{
			path: "../assets/font/neue_regrade_bold_italic-webfont.woff2",
			weight: "bold",
			style: "italic",
		},
		{
			path: "../assets/font/neue_regrade_bold-webfont.woff2",
			weight: "bold",
			style: "normal",
		},
		{
			path: "../assets/font/neue_regrade_medium_italic-webfont.woff2",
			weight: "normal",
			style: "italic",
		},
		{
			path: "../assets/font/neue_regrade_medium-webfont.woff2",
			weight: "normal",
			style: "normal",
		},
	],
});

export const inter = localFont({
	variable: "--font-inter",
	src: [
		{
			path: "../assets/font/Inter-Regular.woff2",
			weight: "400",
			style: "normal",
		},
		{
			path: "../assets/font/Inter-Italic.woff2",
			weight: "400",
			style: "italic",
		},
		{
			path: "../assets/font/Inter-SemiBold.woff2",
			weight: "600",
			style: "normal",
		},
		{
			path: "../assets/font/Inter-SemiBoldItalic.woff2",
			weight: "600",
			style: "italic",
		},
		{
			path: "../assets/font/Inter-Bold.woff2",
			weight: "700",
			style: "normal",
		},
		{
			path: "../assets/font/Inter-BoldItalic.woff2",
			weight: "700",
			style: "italic",
		},
		{
			path: "../assets/font/Inter-italic.var.woff2",
			weight: "100 900",
			style: "italic",
		},
		{
			path: "../assets/font/Inter.var.woff2",
			weight: "100 900",
			style: "normal",
		},
	],
});
