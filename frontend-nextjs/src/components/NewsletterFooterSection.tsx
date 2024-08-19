import { NewsletterForm } from "@/components/NewsletterForm";
import AppLogo from "@/components/logos/AppLogo";
import headerImage from "@/images/header-bg.webp";
import dashboardScreenshotDark from "@/images/home-screenshot-dashboard-dark.webp";
import dashboardScreenshotLight from "@/images/home-screenshot-dashboard-light.webp";
import { cn } from "@/utility/classNames";
import Image from "next/image";

function NewsletterFooterSection() {
	return (
		<div
			className={cn(
				"w-full bg-brandGreen bg-blend-screen relative z-0",
				"overflow-clip grid grid-cols-1 xl:grid-cols-2 gap-x-12 items-center justify-center",
			)}
		>
			<div className="flex flex-col gap-2 justify-center items-center px-[var(--pagePadding)] py-[clamp(2rem,4vmax,8rem)]">
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
				<div className="prose w-full max-w-[32rem]">
					<span
						className={cn(
							"opacity-100 motion-safe:transition-opacity hover:opacity-80 focusable",
							"flex items-center gap-3 not-prose",
						)}
					>
						<AppLogo hideType className="text-brandWhite" />{" "}
						<span className="text-brandWhite opacity-50 text-sm">beta</span>
					</span>
					<div className="flex flex-col gap-6 text-brandWhite not-prose mt-8">
						<h2 className="m-0 text-2xl xl:text-3xl font-headlines text-balance font-semibold">
							Receive updates and get notified when we launch the v1!
						</h2>
						<NewsletterForm />
					</div>
				</div>
			</div>
			<div className="w-full h-80 xl:h-full relative">
				<Image
					src={dashboardScreenshotLight}
					alt="A screenshot of the dashboard (light mode)"
					priority
					className={cn(
						"absolute inset-y-0 inset-x-[var(--pagePadding)] xl:inset-0 object-cover object-left-top h-full",
						"xl:translate-y-24 rounded-tl-lg shadow-black/30 shadow-xl",
						"dark:hidden",
					)}
				/>
				<Image
					src={dashboardScreenshotDark}
					alt="A screenshot of the dashboard (dark mode)"
					priority
					className={cn(
						"absolute inset-y-0 inset-x-[var(--pagePadding)] xl:inset-0 object-cover object-left-top h-full",
						"xl:translate-y-24 rounded-tl-lg shadow-black/30 shadow-xl",
						"hidden dark:block",
					)}
				/>
			</div>
		</div>
	);
}

export default NewsletterFooterSection;
