import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/utility/classNames";

const badgeVariants = cva(
	"inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors focusable",
	{
		variants: {
			variant: {
				default:
					"border-transparent bg-grayLight text-fg hover:bg-fg hover:fg-bg",
				secondary:
					"border-transparent bg-grayLight text-grayDark hover:bg-grayDark hover:text-grayLight",
				outline: "text-grayDark",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

export type BadgeProps = React.HTMLAttributes<HTMLDivElement> &
	VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
	return (
		<div className={cn(badgeVariants({ variant }), className)} {...props} />
	);
}
