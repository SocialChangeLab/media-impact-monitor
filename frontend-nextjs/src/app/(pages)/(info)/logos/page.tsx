import { cn } from "@/utility/classNames";
import Image from "next/image";

import bmbfHybridLogo from "../../../../../public/images/logos/bmbf-hybrid.svg";
import bmbfNegativeLogo from "../../../../../public/images/logos/bmbf-negative.svg";
import bmbfPositiveLogo from "../../../../../public/images/logos/bmbf-positive.svg";

import prototypeFundHybridLogo from "../../../../../public/images/logos/prototypefund-hybrid.svg";
import prototypeFundNegativeLogo from "../../../../../public/images/logos/prototypefund-negative.svg";
import prototypeFundPositiveLogo from "../../../../../public/images/logos/prototypefund-positive.svg";

import socialChangeLabHybridLogo from "../../../../../public/images/logos/socialchangelab-hybrid.svg";
import socialChangeLabNegativeLogo from "../../../../../public/images/logos/socialchangelab-negative.svg";
import socialChangeLabPositiveLogo from "../../../../../public/images/logos/socialchangelab-positive.svg";

import mimHorizontalHybridLogo from "../../../../../public/images/logos/mim-horizontal-hybrid.svg";
import mimHorizontalNegativeLogo from "../../../../../public/images/logos/mim-horizontal-negative.svg";
import mimHorizontalPositiveLogo from "../../../../../public/images/logos/mim-horizontal-positive.svg";

import mimAlternateHybridLogo from "../../../../../public/images/logos/mim-alternate-hybrid.svg";
import mimAlternateNegativeLogo from "../../../../../public/images/logos/mim-alternate-negative.svg";
import mimAlternatePositiveLogo from "../../../../../public/images/logos/mim-alternate-positive.svg";

import mimStairsHybridLogo from "../../../../../public/images/logos/mim-stairs-hybrid.svg";
import mimStairsNegativeLogo from "../../../../../public/images/logos/mim-stairs-negative.svg";
import mimStairsPositiveLogo from "../../../../../public/images/logos/mim-stairs-positive.svg";

import mimVerticalHybridLogo from "../../../../../public/images/logos/mim-vertical-hybrid.svg";
import mimVerticalNegativeLogo from "../../../../../public/images/logos/mim-vertical-negative.svg";
import mimVerticalPositiveLogo from "../../../../../public/images/logos/mim-vertical-positive.svg";

type LogoType = {
	src: string;
	height: number;
	width: number;
	blurWidth: number;
	blurHeight: number;
	name: string;
	alt: string;
};

const bmbfLogos: LogoType[] = [
	{
		...bmbfPositiveLogo,
		name: "bmbf-positive.svg",
		alt: "Bundesministerium für Bildung und Forschung",
	},
	{
		...bmbfNegativeLogo,
		name: "bmbf-negative.svg",
		alt: "Bundesministerium für Bildung und Forschung",
	},
	{
		...bmbfHybridLogo,
		name: "bmbf-hybrid.svg",
		alt: "Bundesministerium für Bildung und Forschung",
	},
];

const prototypeFundLogos: LogoType[] = [
	{
		...prototypeFundPositiveLogo,
		name: "prototypefund-positive.svg",
		alt: "Prototype Fund",
	},
	{
		...prototypeFundNegativeLogo,
		name: "prototypefund-negative.svg",
		alt: "Prototype Fund",
	},
	{
		...prototypeFundHybridLogo,
		name: "prototypefund-hybrid.svg",
		alt: "Prototype Fund",
	},
];

const socialChangeLabLogos: LogoType[] = [
	{
		...socialChangeLabPositiveLogo,
		name: "socialchangelab-positive.svg",
		alt: "Social Change Lab",
	},
	{
		...socialChangeLabNegativeLogo,
		name: "socialchangelab-negative.svg",
		alt: "Social Change Lab",
	},
	{
		...socialChangeLabHybridLogo,
		name: "socialchangelab-hybrid.svg",
		alt: "Social Change Lab",
	},
];

const mimLogos: LogoType[] = [
	{
		...mimHorizontalPositiveLogo,
		name: "mim-horizontal-positive.svg",
		alt: "Media Impact Monitor",
	},
	{
		...mimHorizontalNegativeLogo,
		name: "mim-horizontal-negative.svg",
		alt: "Media Impact Monitor",
	},
	{
		...mimHorizontalHybridLogo,
		name: "mim-horizontal-hybrid.svg",
		alt: "Media Impact Monitor",
	},
	{
		...mimAlternatePositiveLogo,
		name: "mim-alternate-positive.svg",
		alt: "Media Impact Monitor",
	},
	{
		...mimAlternateNegativeLogo,
		name: "mim-alternate-negative.svg",
		alt: "Media Impact Monitor",
	},
	{
		...mimAlternateHybridLogo,
		name: "mim-alternate-hybrid.svg",
		alt: "Media Impact Monitor",
	},
	{
		...mimStairsPositiveLogo,
		name: "mim-stairs-positive.svg",
		alt: "Media Impact Monitor",
	},
	{
		...mimStairsNegativeLogo,
		name: "mim-stairs-negative.svg",
		alt: "Media Impact Monitor",
	},
	{
		...mimStairsHybridLogo,
		name: "mim-stairs-hybrid.svg",
		alt: "Media Impact Monitor",
	},
	{
		...mimVerticalPositiveLogo,
		name: "mim-vertical-positive.svg",
		alt: "Media Impact Monitor",
	},
	{
		...mimVerticalNegativeLogo,
		name: "mim-vertical-negative.svg",
		alt: "Media Impact Monitor",
	},
	{
		...mimVerticalHybridLogo,
		name: "mim-vertical-hybrid.svg",
		alt: "Media Impact Monitor",
	},
];

const logos: LogoType[] = [
	...mimLogos,
	...bmbfLogos,
	...prototypeFundLogos,
	...socialChangeLabLogos,
];
export default async function AboutPage() {
	return (
		<>
			<h1 className="text-6xl font-headlines font-bold mt-4">Logo assets</h1>
			<ul
				className={cn(
					"w-full max-w-prose not-prose",
					"grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4",
				)}
			>
				{logos.map((logo) => {
					const logoUrl = `/assets/logos/${logo.name}`;
					return (
						<li
							key={logo.name}
							className={cn(
								"grid grid-rows-[1fr_auto] gap-px bg-grayLight border border-grayLight",
							)}
						>
							<a
								download={logo.name}
								href={logoUrl}
								title={logo.alt}
								className={cn(
									"relative flex flex-col items-center justify-center",
									"p-6 focusable",
									logo.name.includes("-negative") && "bg-black",
									!logo.name.includes("-negative") && "bg-white",
								)}
							>
								{logo.name.includes("-hybrid") && (
									<div
										aria-hidden="true"
										className="absolute inset-0 bg-gradient-to-r from-50% to-50% from-white to-black z-0"
									/>
								)}
								<Image src={logo} alt={logo.alt} className="relative z-10" />
							</a>
							<div className="bg-bg p-3 flex justify-between">
								<button
									type="button"
									data-url={`https://mediaimpactmonitor.app${logoUrl}`}
									className={cn(
										"copy-button",
										"px-2 py-1 underline w-fit h-fit text-base",
										"font-headlines focusable",
										"hover:bg-fg hover:text-bg transition-colors",
										"hover:no-underline",
									)}
								>
									Copy URL
								</button>
								<a
									href={logoUrl}
									download={logo.name}
									title={`Download ${logo.alt}'s logo'`}
									className={cn(
										"px-2 py-1 underline w-fit h-fit text-base",
										"font-headlines focusable",
										"hover:bg-fg hover:text-bg transition-colors",
										"hover:no-underline",
									)}
								>
									Download
								</a>
							</div>
						</li>
					);
				})}
			</ul>
		</>
	);
}
