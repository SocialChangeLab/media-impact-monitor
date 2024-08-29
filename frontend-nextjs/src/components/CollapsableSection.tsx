"use client";
import { type ReactNode, useEffect, useState } from "react";
import HeadlineWithLine from "./HeadlineWithLine";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "./ui/accordion";

function CollapsableSection({
	title,
	storageKey,
	storageType,
	children,
	className,
	defaultExpanded = true,
}: {
	title: string;
	storageKey: string;
	storageType?: "local" | "session";
	children: ReactNode;
	className?: string;
	defaultExpanded?: boolean;
}) {
	const [isExpanded, setExpanded] = useState(defaultExpanded);

	useEffect(() => {
		if (!storageType || typeof window === "undefined") return;
		const storage =
			storageType === "local" ? window.localStorage : window.sessionStorage;
		const value = storage.getItem(storageKey);
		setExpanded((value === null && defaultExpanded) || value === "true");
	}, [storageKey, storageType, defaultExpanded]);

	return (
		<Accordion
			type="single"
			collapsible
			className={className || ""}
			onValueChange={(value) => {
				if (!storageType || typeof window === "undefined") return;
				const storage =
					storageType === "local" ? window.localStorage : window.sessionStorage;
				storage.setItem(storageKey, value === title ? "true" : "false");
				setExpanded(value === title);
			}}
			value={isExpanded ? title : undefined}
		>
			<AccordionItem
				value={title}
				className="border-b-0"
				aria-expanded={isExpanded}
			>
				<AccordionTrigger className="gap-4 focusable py-0">
					<HeadlineWithLine>{title}</HeadlineWithLine>
				</AccordionTrigger>
				<AccordionContent className="pt-4">{children}</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}

export default CollapsableSection;
