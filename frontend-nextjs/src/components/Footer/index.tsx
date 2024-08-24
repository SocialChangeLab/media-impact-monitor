"use client";

import UptimeStatusLink from "@/components/UptimeStatusLink";
import Logo from "@/components/logos/AppLogo";
import BMBFLogo from "@/components/logos/BMBFLogo";
import PrototypeFundLogo from "@/components/logos/PrototypeFundLogo";
import SocialChangeLabLogo from "@/components/logos/SocialChangeLabLogo";
import { useToday } from "@/providers/TodayProvider";
import { cn } from "@/utility/classNames";
import { useAnimationFrame } from "framer-motion";
import { ArrowUp, ExternalLink, GithubIcon } from "lucide-react";
import { useRef } from "react";
import InternalLink from "../InternalLink";

function Footer() {
	const footerRef = useRef<HTMLElement>(null);
	const { today } = useToday();
	const year = today.getFullYear();

	useAnimationFrame(() => {
		if (!footerRef.current) return;
		const height = footerRef.current.getBoundingClientRect().height;
		document.documentElement.style.setProperty(
			"--footerHeight",
			`${Math.floor(height)}px`,
		);
	});
	return (
		<footer
			className="mx-auto w-full relative"
			aria-label="Main page footer"
			ref={footerRef}
		>
			<div className="flex flex-wrap gap-8 items-end w-full px-6 py-8 relative border-y border-grayLight">
				<div className="flex md:flex-col gap-4 justify-between">
					<InternalLink
						href="/dashboard"
						className="flex flex-col gap-4 justify-between w-fit focusable"
						scroll={false}
					>
						<Logo className="text-grayDark origin-top-left scale-90" hideType />
					</InternalLink>

					<div className="flex flex-col gap-4 justify-between text-grayDark text-sm">
						<InternalLink
							href="/logos"
							className="no-underline focusable hover:text-fg transition-colors w-fit"
							scroll={false}
						>
							Logo assets
						</InternalLink>
						<UptimeStatusLink />
						<a
							href="https://github.com/SocialChangeLab/media-impact-monitor"
							target="_blank"
							rel="noopener noreferrer"
							className="no-underline focusable hover:text-fg transition-colors w-fit flex gap-1 items-center"
						>
							<GithubIcon className="size-4 text-grayDark" />
							GitHub
							<ExternalLink className="size-4 opacity-50" />
						</a>
						<span aria-label={`Copyright ${year}`}>
							© {year} - Social Change Lab
						</span>
					</div>
				</div>
				<div className="flex flex-wrap gap-x-6 md:gap-x-8 lg:gap-x-16 gap-y-8 max-w-full pr-4 max-sm:border-t border-grayLight max-sm:pt-6 max-sm:w-full">
					<div className="flex flex-wrap gap-x-16">
						<a
							className="h-fit focusable flex flex-col gap-4 group"
							href="https://socialchangelab.org/"
							target="_blank"
							rel="noopener noreferrer"
							title="Social Change Lab"
						>
							<span className="no-underline text-sm text-grayDark">
								Hosted by
							</span>
							<SocialChangeLabLogo
								className={cn(
									"origin-top-left transition-transform group-hover:scale-105",
									"text-[#3552C8] w-[112px] h-[56px] lg:w-[150px] lg:h-[75px]",
									"dark:text-white dark:opacity-80 dark:grayscale dark:brightness-[10]",
								)}
								aria-label="Social Change Lab Logo"
								width={105}
								height={75}
							/>
						</a>
					</div>
					<div className="flex flex-wrap gap-x-8 gap-y-4">
						<a
							className="h-fit focusable flex flex-col gap-6 group"
							href="https://prototypefund.de/"
							target="_blank"
							rel="noopener noreferrer"
							title="Bundesministerium für Bildung und Forschung"
						>
							<span className="no-underline text-sm text-grayDark w-fit">
								Sponsored by
							</span>
							<BMBFLogo
								className={cn(
									"origin-top-left transition-transform group-hover:scale-105",
									"text-fg w-[112px] h-[56px] lg:w-[150px] lg:h-[75px]",
									"dark:text-white dark:opacity-80 dark:grayscale dark:brightness-[10]",
								)}
								aria-label="Bundesministerium für Bildung und Forschung"
							/>
						</a>
						<a
							className="focusable flex flex-col gap-6 group w-fit h-fit"
							href="https://prototypefund.de/"
							target="_blank"
							rel="noopener noreferrer"
							title="Prototype Fund"
						>
							<span className="no-underline text-fg ">&nbsp;</span>
							<PrototypeFundLogo
								className={cn(
									"origin-top-left transition-transform group-hover:scale-105",
									"text-fg w-[28px] h-[51px] lg:w-[56px] lg:h-[102px]",
									"dark:text-white dark:opacity-80 dark:grayscale dark:brightness-[10]",
								)}
								aria-label="Prototype Fund Logo"
								width={56}
								height={102}
							/>
						</a>
					</div>
				</div>
			</div>
			<button
				type="button"
				id="back-to-top"
				aria-label="Scroll to top"
				className={cn(
					`absolute right-6 top-6`,
					`p-1 text-fg border border-transparent`,
					`hover:bg-grayUltraLight motion-safe:transition-colors`,
					`focusable hover:border-grayLight`,
				)}
				onClick={() => {
					if (typeof window === "undefined") return;
					window.scrollTo({ top: 0, behavior: "smooth" });
				}}
			>
				<ArrowUp />
			</button>
		</footer>
	);
}

export default Footer;
