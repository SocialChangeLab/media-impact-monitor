"use client";
import { cn } from "@/utility/classNames";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { Fragment, forwardRef } from "react";
import { z } from "zod";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

// Constants –––––––––––––––––––––––––––––––––

const UPTIME_KUMA_BASE_URL =
	process.env.NEXT_PUBLIC_UPTIME_KUMA_BASE_URL ||
	`https://status.mediaimpactmonitor.app`;

// ZOD Schemas –––––––––––––––––––––––––––––––––

const ConfigSchema = z.object({
	slug: z.string(),
	title: z.string(),
	description: z.string(),
	icon: z.string(),
	theme: z.enum(["auto", "light", "dark"]).optional(), // `theme` might have specific values
	published: z.boolean(),
	showTags: z.boolean(),
	customCSS: z.string().nullable(),
	footerText: z.string().nullable(),
	showPoweredBy: z.boolean(),
	googleAnalyticsId: z.string().nullable(),
	showCertificateExpiry: z.boolean(),
});

const MonitorSchema = z.object({
	id: z.number(),
	name: z.string(),
});

const PublicGroupSchema = z.object({
	id: z.number(),
	name: z.string(),
	weight: z.number(),
	monitorList: z.array(MonitorSchema),
});

const UptimeStatusSchema = z.object({
	config: ConfigSchema,
	incident: z.null(),
	publicGroupList: z.array(PublicGroupSchema),
	maintenanceList: z.array(z.unknown()), // Assuming we don't have details about the structure of maintenanceList items
});

// Types –––––––––––––––––––––––––––––––––

type StatusType = "up" | "down" | "unknown" | "partial";
type MonitorType = z.infer<typeof MonitorSchema>;

type MonitorWithStatusType = MonitorType & {
	status: StatusType;
};

// Data –––––––––––––––––––––––––––––––––

const fallbackMonitors: MonitorType[] = [
	{
		id: 1,
		name: "production website",
	},
	{
		id: 3,
		name: "production api docs",
	},
	{
		id: 2,
		name: "staging website",
	},
	{
		id: 4,
		name: "staging api docs",
	},
	{
		id: 5,
		name: "staging api events",
	},
	{
		id: 6,
		name: "staging api trend news_online keywords",
	},
	{
		id: 8,
		name: "staging api trend news_online sentiment",
	},
	{
		id: 7,
		name: "staging api trend news_print keywords",
	},
	{
		id: 9,
		name: "staging api trend web_google keywords",
	},
	{
		id: 10,
		name: "staging api fulltexts",
	},
	{
		id: 11,
		name: "staging api impact",
	},
];

// Utility functions –––––––––––––––––––––––––––––––––

function getBadgeUrl(monitorId: number) {
	const config = {
		style: "flat-square",
		prefixLabel: "Impact",
		upColor: "#229E74",
		downColor: "#D55E00",
	};
	const query = new URLSearchParams(config).toString();
	return `${UPTIME_KUMA_BASE_URL}/api/badge/${monitorId}/status?${query}`;
}

async function fetchMonitorUrl(monitor: MonitorType) {
	try {
		const response = await fetch(getBadgeUrl(monitor.id), {
			headers: { "cache-control": "no-cache" },
		});
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
	const allUnknown = monitors.every((monitor) => monitor.status === "unknown");
	if (allUp) return "up";
	if (allDown) return "down";
	if (allUnknown) return "unknown";
	return "partial";
}

async function fetchMonitors() {
	let monitors: MonitorType[] = fallbackMonitors;
	try {
		const response = await fetch(
			`${UPTIME_KUMA_BASE_URL}/api/status-page/main`,
		);
		const json = await response.json();
		const parsed = UptimeStatusSchema.parse(json);
		monitors =
			parsed.publicGroupList.find(({ name }) => name === "Services")
				?.monitorList ?? fallbackMonitors;
	} catch (error) {
		console.error(error);
	}
	const monitorObjects = await Promise.all(
		monitors.map((monitor) => fetchMonitorUrl(monitor)),
	);
	return {
		monitors: monitorObjects,
		overallStatus: getOverallStatus(monitorObjects),
	};
}

function formatMonitorName(str: string) {
	const nameWithoutUnderscores = str.replace("_", " ");
	const nameInTitleCase = nameWithoutUnderscores.replace(
		/\w\S*/g,
		(txt) => txt.charAt(0).toUpperCase() + txt.substr(1),
	);
	return nameInTitleCase.replace(" Api ", " API ");
}

// Components –––––––––––––––––––––––––––––––––

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

function UptimeStatusLink() {
	const query = useQuery({
		queryKey: ["uptimeStatus"],
		queryFn: fetchMonitors,
		// refetch every 5 minutes
		refetchInterval: 5 * 60 * 1000,
	});

	if (!query.isSuccess || !query.data)
		return <UptimeStatusLinkAnchor status="unknown" />;

	return (
		<Tooltip delayDuration={50} disableHoverableContent>
			<TooltipTrigger className="inline-block w-fit bg-none">
				<UptimeStatusLinkAnchor status={query.data.overallStatus} />
			</TooltipTrigger>
			<TooltipContent className="w-fit" align="start">
				<ul
					className="inline-grid grid-cols-[auto_auto] gap-x-2 gap-y-1 items-center"
					style={{
						gridTemplateRows: `repeat(${query.data.monitors.length}, 20px)`,
					}}
				>
					{query.data.monitors.map((monitor) => (
						<Fragment key={monitor.id}>
							<UptimeStatusPill status={monitor.status} />
							{formatMonitorName(monitor.name.replace("_", " ")).replace(
								" Api ",
								" API ",
							)}
						</Fragment>
					))}
				</ul>
			</TooltipContent>
		</Tooltip>
	);
}
export default UptimeStatusLink;
