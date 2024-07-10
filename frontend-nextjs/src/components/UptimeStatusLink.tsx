"use client";
import { ExternalLink } from "lucide-react";

// Constants –––––––––––––––––––––––––––––––––

const UPTIME_KUMA_BASE_URL =
	process.env.NEXT_PUBLIC_UPTIME_KUMA_BASE_URL ||
	`https://status.mediaimpactmonitor.app`;

// Component –––––––––––––––––––––––––––––––––

function UptimeStatusLink() {
	return (
		<a
			href={UPTIME_KUMA_BASE_URL}
			target="_blank"
			rel="noopener noreferrer"
			className="flex gap-2 items-center"
		>
			App status
			<ExternalLink size={16} className="opacity-50" />
		</a>
	);
}

export default UptimeStatusLink;
