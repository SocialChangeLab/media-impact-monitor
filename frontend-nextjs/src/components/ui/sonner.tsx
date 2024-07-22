"use client";

import { cn } from "@/utility/classNames";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = "system" } = useTheme();

	return (
		<Sonner
			theme={theme as ToasterProps["theme"]}
			className="toaster group"
			toastOptions={{
				classNames: {
					toast: cn(
						"group toast group-[.toaster]:bg-bg group-[.toaster]:text-fg",
						"group-[.toaster]:border-grayMed group-[.toaster]:shadow-lg",
						"pr-8 gap-2",
					),
					description: "group-[.toast]:text-grayDark",
					content: "[&>div]:leading-tight",
					actionButton: "group-[.toast]:bg-fg group-[.toast]:text-bg focusable",
					cancelButton: cn(
						"group-[.toast]:bg-bg group-[.toast]:text-fg group-[.toast]:border",
						"group-[.toast]:hover:bg-grayLight group-[.toast]:border-grayLight",
						"group-[.toast]:rounded-none focusable",
					),
					icon: "shrink-0",
					closeButton: cn(
						"left-auto right-3 top-1/2 -translate-y-1/2 shrink-0 size-6",
						"[&>svg]:stroke-2 [&>svg]:h-4 [&>svg]:w-4 focusable",
					),
				},
			}}
			{...props}
		/>
	);
};

export { Toaster };
