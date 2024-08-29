"use client";
import { cn } from "@/utility/classNames";
import { memo } from "react";
import { z } from "zod";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

function ExternalLink({ href }: { href: string }) {
	const parsingResult = z.string().url().safeParse(href);
	if (!parsingResult.success) return <span>{href}</span>;
	const url = new URL(href);
	const hostname = url.hostname.replace("www.", "");
	const path = url.pathname.replace(/^\//, "");
	const urlWithoutPath = `${url.protocol}//${hostname}`;
	return (
		<Tooltip delayDuration={50}>
			<TooltipTrigger asChild>
				<a
					href={href}
					target="_blank"
					rel="noopener noreferrer"
					className={cn(
						"inline-grid grid-cols-[20px_auto_auto] items-center",
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
					<span className="pl-2  text-nowrap">{hostname}</span>
					{path && (
						<span className="text-grayDark text-nowrap opacity-75 group-hover:opacity-100 group-hover:text-fg transition truncate max-w-full">
							/{path}
						</span>
					)}
				</a>
			</TooltipTrigger>
			<TooltipContent className="w-fit max-w-72 break-all">
				{href}
			</TooltipContent>
		</Tooltip>
	);
}

export default memo(ExternalLink);
