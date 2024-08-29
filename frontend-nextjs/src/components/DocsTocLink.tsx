"use client";
import { cn } from "@/utility/classNames";
import { usePathname } from "next/navigation";

export function DocsTocLink(props: {
	title: string;
	slug: string;
	child?: boolean;
}) {
	const pathname = usePathname();
	const currentPage = pathname.split("/")[2] || "introduction";
	return (
		<a
			href={`/docs/${props.slug}`}
			className={cn(
				"block text-grayDark hover:text-fg",
				props.child && "pl-4 py-1 border-l border-grayLight",
				currentPage === props.slug && "font-bold text-fg",
				currentPage === props.slug && props.child && "border-l-2 border-fg",
			)}
		>
			{props.title}
		</a>
	);
}
