import { cn } from "@/utility/classNames";
import type { ReactNode } from "react";
import { Badge, type BadgeProps } from "./badge";

export function IconBadge({
	icon,
	badgeProps = {},
	label,
}: {
	icon: ReactNode;
	badgeProps?: BadgeProps;
	label?: string;
}) {
	return (
		<Badge
			variant="outline"
			{...badgeProps}
			className={cn("w-fit pl-1.5 py-0.5", badgeProps.className)}
		>
			{icon}
			{label && <span>{label}</span>}
		</Badge>
	);
}
