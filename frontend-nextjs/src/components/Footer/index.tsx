"use client";

import UptimeStatusLink from "@/components/UptimeStatusLink";
import Logo from "@/components/logos/AppLogo";
import BMBFLogo from "@/components/logos/BMBFLogo";
import PrototypeFundLogo from "@/components/logos/PrototypeFundLogo";
import SocialChangeLabLogo from "@/components/logos/SocialChangeLabLogo";
import { cn } from "@/utility/classNames";
import { ArrowUp } from "lucide-react";
import InternalLink from "../InternalLink";

const year = new Date().getFullYear();

function Footer() {
	return (
		<footer className="mx-auto w-full relative" aria-label="Main page footer">
			<div className="flex justify-between w-full px-6 py-8 relative border-y border-grayLight">
				<div className="flex flex-col gap-4 justify-between">
					<InternalLink
						href="/dashboard"
						className="flex flex-col gap-4 justify-between w-fit focusable"
						scroll={false}
					>
						<Logo className="text-grayDark" width={256} height={31} />
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
						<span aria-label={`Copyright ${year}`}>
							© {year} - Social Change Lab
						</span>
					</div>
				</div>
				<div className="flex flex-wrap gap-x-16 gap-y-8 max-w-full pr-4">
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
								className="origin-top-left transition-transform group-hover:scale-105 text-[#3552C8] dark:text-white dark:opacity-80"
								aria-label="Social Change Lab Logo"
								width={105}
								height={75}
							/>
						</a>
					</div>
					<div className="flex flex-wrap gap-x-8">
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
								className="origin-top-left transition-transform group-hover:scale-105 text-fg dark:text-white dark:opacity-80 dark:grayscale dark:brightness-[10]"
								aria-label="Bundesministerium für Bildung und Forschung"
								width={150}
								height={75}
							/>
						</a>
						<a
							className="focusable flex flex-col gap-6 group w-fit h-fit"
							href="https://prototypefund.de/"
							target="_blank"
							rel="noopener noreferrer"
							title="Prototype Fund"
						>
							<span className="no-underline text-fg hidden xs:inline-block">
								&nbsp;
							</span>
							<PrototypeFundLogo
								className="origin-top-left transition-transform group-hover:scale-105 text-fg dark:text-white dark:opacity-80 dark:grayscale dark:brightness-[10]"
								aria-label="Prototype Fund Logo"
								width={56}
								height={102}
							/>
						</a>
					</div>
					<div className="flex flex-col gap-4">
						<button
							type="button"
							id="back-to-top"
							aria-label="Scroll to top"
							className={cn(
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
					</div>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
