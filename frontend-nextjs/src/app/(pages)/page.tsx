import InternalLink from "@/components/InternalLink";
import AppLogo from "@/components/logos/AppLogo";
import { buttonVariants } from "@/components/ui/button";
import headerImage from "@/images/header-bg.webp";
import dashboardScreenshotDark from "@/images/home-screenshot-dashboard-dark.webp";
import dashboardScreenshotLight from "@/images/home-screenshot-dashboard-light.webp";
import { cn } from "@/utility/classNames";
import Image from "next/image";

export default function HomePageWithSuspense() {
	return (
		<div
			className={cn(
				"w-full sm:min-h-[calc(100vh-4rem)] bg-brandGreen bg-blend-screen relative z-0",
				"overflow-clip",
				"grid grid-cols-1 xl:grid-cols-[2fr_3fr] gap-12 items-center justify-center",
			)}
		>
			<div className="flex flex-col gap-4 justify-center items-center px-[clamp(1rem,2vmax,4rem)] py-[clamp(2rem,4vmax,8rem)]">
				<Image
					src={headerImage}
					alt="A decorative header image of a crowd protesting"
					className="absolute -z-10 w-full h-full sm:min-h-40 inset-0 object-cover mix-blend-screen opacity-10"
					fill
					priority={true}
				/>
				<div
					className="absolute -z-10 inset-0 w-full h-full sm:min-h-40 bg-repeat bg-center mix-blend-screen bg-[url(/images/noisy-dark.webp)]"
					aria-hidden="true"
				/>
				<div className="prose max-w-[50ch]">
					<span
						className={cn(
							"opacity-100 motion-safe:transition-opacity hover:opacity-80 focusable",
							"flex items-center gap-3 not-prose",
						)}
					>
						<AppLogo hideType className="text-brandWhite" />{" "}
						<span className="text-brandWhite opacity-50 text-sm">alpha</span>
					</span>
					<h1 className="text-4xl font-bold font-headlines antialiased text-brandWhite pr-12 md:pr-0 mt-8 mb-6 text-balance">
						Welcome to the Media Impact Monitor
					</h1>
					<p className="text-brandWhite mb-3">
						The Media Impact Monitor is a collaborative project aimed at
						enabling protest groups and NGOs to evaluate their impact on public
						discourse.
					</p>
					<p className="text-brandWhite mt-0">
						Through the examination of various media sources, from local and
						national newspapers to social media and parliamentary debates, the
						tool provides a detailed view of how activism influences public
						discussion.
					</p>
					<div className="flex gap-4 flex-wrap pt-6 not-prose">
						<InternalLink
							href={"/dashboard"}
							className={cn(
								buttonVariants({ variant: "default" }),
								`text-brandGreen bg-brandWhite focus-visible:ring-offset-0`,
								`focus-visible:bg-brandGreen focus-visible:ring-brandWhite`,
								`focus-visible:text-brandWhite`,
								"hover:bg-brandGreen hover:text-brandWhite",
							)}
						>
							{`Go to the dashboard`}
						</InternalLink>
						<InternalLink
							href={"/about"}
							className={cn(
								buttonVariants({ variant: "outline" }),
								`text-brandWhite focus-visible:ring-offset-0`,
								`focus-visible:bg-brandGreen focus-visible:ring-brandWhite`,
								`focus-visible:text-brandWhite`,
								"hover:bg-brandGreen hover:text-brandWhite hover:border-brandGreen",
							)}
						>
							{`About`}
						</InternalLink>
						<InternalLink
							href={"/docs"}
							className={cn(
								buttonVariants({ variant: "outline" }),
								`text-brandWhite focus-visible:ring-offset-0`,
								`focus-visible:bg-brandGreen focus-visible:ring-brandWhite`,
								`focus-visible:text-brandWhite`,
								"hover:bg-brandGreen hover:text-brandWhite hover:border-brandGreen",
							)}
						>
							{`Documentation`}
						</InternalLink>
					</div>
				</div>
			</div>
			<div className="w-full h-[calc(100vh-4rem)] relative">
				<Image
					src={dashboardScreenshotLight}
					alt="A screenshot of the dashboard (light mode)"
					priority
					className={cn(
						"absolute inset-y-0 inset-x-4 xl:inset-0 object-cover object-left-top h-full",
						"translate-y-24 rounded-tl-lg shadow-black/30 shadow-xl",
						"dark:hidden",
					)}
				/>
				<Image
					src={dashboardScreenshotDark}
					alt="A screenshot of the dashboard (dark mode)"
					priority
					className={cn(
						"absolute inset-y-0 inset-x-4 xl:inset-0 object-cover object-left-top h-full",
						"translate-y-24 rounded-tl-lg shadow-black/30 shadow-xl",
						"hidden dark:block",
					)}
				/>
			</div>
		</div>
	);
}
