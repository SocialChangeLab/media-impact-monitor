import { cn } from "@/utility/classNames";
import { memo } from "react";
import { z } from "zod";

function ExternalLink({ href }: { href: string }) {
	const parsingResult = z.string().url().safeParse(href);
	if (!parsingResult.success) return <span>{href}</span>;
	const url = new URL(href);
	const hostname = url.hostname.replace("www.", "");
	const path = url.pathname.replace(/^\//, "");
	const urlWithoutPath = `${url.protocol}//${hostname}`;
	return (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			className={cn(
				"inline-grid grid-cols-[20px_auto] gap-2 items-center",
				"group hover:decoration-fg w-fit max-w-full",
				"underline decoration-grayMed underline-offset-4 transition",
			)}
		>
			<img
				src={`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=32&url=${urlWithoutPath}`}
				width={20}
				height={20}
				alt={`Favicon for ${hostname}`}
				className={cn("shrink-0")}
			/>
			<span className="flex items-center">
				<span>{hostname}</span>
				{path && (
					<span className="text-grayDark opacity-75 group-hover:opacity-100 group-hover:text-fg transition truncate">
						/{path}
					</span>
				)}
			</span>
		</a>
	);
}

export default memo(ExternalLink);
