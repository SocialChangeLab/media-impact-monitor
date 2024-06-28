"use client";
import { cn } from "@/utility/classNames";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { forwardRef } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const UPTIME_KUMA_BASE_URL =
	process.env.NEXT_PUBLIC_UPTIME_KUMA_BASE_URL ||
	`https://status.mediaimpactmonitor.app`;

type MonitorType = {
	id: number;
	name: string;
};

type StatusType = "up" | "down" | "unknown" | "partial";

type MonitorWithStatusType = MonitorType & {
	status: StatusType;
};

const UptimeStatusLinkAnchor = forwardRef<
	HTMLAnchorElement,
	{ status: StatusType }
>((props, ref) => (
	<a
		ref={ref}
		href={UPTIME_KUMA_BASE_URL}
		target="_blank"
		rel="noopener noreferrer"
		className="w-fit inline-grid grid-cols-[auto_auto] gap-x-2 items-center"
	>
		<UptimeStatusPill status={props.status} />
		<span className="flex gap-2 items-center">
			App status
			<ExternalLink size={16} className="opacity-50" />
		</span>
	</a>
));

function UptimeStatusPill({ status }: { status: StatusType }) {
	return (
		<span
			className={cn(
				"inline-block size-3 rounded-full ring-[1px] ring-[rgba(0,0,0,0.1)] ring-inset",
				status === "up" && "bg-[var(--sentiment-positive)]",
				status === "down" && "bg-[var(--sentiment-negative)]",
				status === "partial" && "bg-[var(--sentiment-neutral)]",
				status === "unknown" && "bg-[var(--grayLight)]",
			)}
		/>
	);
}

// INFO: Gather new monitors from https://metamonitor.up.railway.app/api/status-page/main
const monitors: MonitorType[] = [
	{ id: 1, name: "production website" },
	{ id: 3, name: "production api docs" },
	{ id: 2, name: "staging website" },
	{ id: 4, name: "staging api docs" },
	{ id: 5, name: "staging api events" },
	{ id: 6, name: "staging api trend news_online keywords" },
	{ id: 8, name: "staging api trend news_online sentiment" },
	{ id: 7, name: "staging api trend news_print keywords" },
	{ id: 9, name: "staging api trend web_google keywords" },
	{ id: 10, name: "staging api fulltexts" },
	{ id: 11, name: "staging api impact" },
];

function getBadgeUrl(monitorId: number) {
	const config = { style: "flat-square" };
	const query = new URLSearchParams(config).toString();
	return `${UPTIME_KUMA_BASE_URL}/api/badge/${monitorId}/status?${query}`;
}

async function fetchMonitor(monitor: MonitorType) {
	try {
		const response = await fetch(getBadgeUrl(monitor.id));
		const svgText = await response.text();
		let status = "unknown" as StatusType;
		if (svgText.includes("<title>Status: Up</title>")) {
			status = "up" as const;
		} else if (svgText.includes("<title>Status: Down</title>")) {
			status = "down" as const;
		}
		return {
			...monitor,
			status: status,
		};
	} catch (error) {
		console.error(error);
		return {
			...monitor,
			status: "unknown" as const,
		};
	}
}

function getOverallStatus(monitors: MonitorWithStatusType[]): StatusType {
	if (!monitors) return "unknown";
	const allUp = monitors.every((monitor) => monitor.status === "up");
	const allDown = monitors.every((monitor) => monitor.status === "down");
	if (allUp) return "up";
	if (allDown) return "down";
	return "partial";
}

async function fetchMonitors() {
	const monitorObjects = await Promise.all(
		monitors.map((monitor) => fetchMonitor(monitor)),
	);
	const overallStatus = getOverallStatus(monitorObjects);
	return {
		monitors: monitorObjects,
		overallStatus: overallStatus,
	};
}

function UptimeStatusLink() {
	const query = useQuery({
		queryKey: ["uptimeStatus"],
		queryFn: fetchMonitors,
	});

	if (!query.isSuccess || !query.data)
		return <UptimeStatusLinkAnchor status="unknown" />;

	return (
		<Tooltip delayDuration={50} disableHoverableContent>
			<TooltipTrigger className="inline-block w-fit bg-none">
				<UptimeStatusLinkAnchor status={query.data.overallStatus} />
			</TooltipTrigger>
			<TooltipContent className="w-fit" align="start">
				<ul className="flex flex-col gap-1">
					{query.data.monitors.map((monitor) => (
						<li key={monitor.id} className="flex gap-2">
							<UptimeStatusPill status={monitor.status} />
							{formatMonitorName(monitor.name)}
						</li>
					))}
				</ul>
			</TooltipContent>
		</Tooltip>
	);
}
export default UptimeStatusLink;

function formatMonitorName(str: string) {
	const nameWithoutUnderscores = str.replace("_", " ");
	const nameInTitleCase = nameWithoutUnderscores.replace(
		/\w\S*/g,
		(txt) => txt.charAt(0).toUpperCase() + txt.substr(1),
	);
	return nameInTitleCase.replace(" Api ", " API ");
}
