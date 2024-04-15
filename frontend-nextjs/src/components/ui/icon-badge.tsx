import { cn } from '@/utility/classNames'
import { ReactNode } from 'react'
import { Badge, BadgeProps } from './badge'

export function IconBadge({
	icon,
	badgeProps = {},
	label,
}: {
	icon: ReactNode
	badgeProps?: BadgeProps
	label?: string
}) {
	return (
		<Badge
			variant="outline"
			{...badgeProps}
			className={cn('w-fit pl-1.5 pt-0.5', badgeProps.className)}
		>
			{icon}
			{label && <span className="mt-0.5">{label}</span>}
		</Badge>
	)
}
