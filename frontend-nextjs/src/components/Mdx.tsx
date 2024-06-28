import CollapsableSection from "@/components/CollapsableSection";
import { useMDXComponent } from "next-contentlayer/hooks";
import Image from "next/image";

import { cn } from "@/utility/classNames";

interface MdxProps {
	code: string;
}

export function Mdx({ code }: MdxProps) {
	const Component = useMDXComponent(code);

	return (
		<div
			className={cn(
				"mdx mt-4 mb-8 prose prose-fg relative",
				"prose-headings:font-headlines prose-headings:antialiased",
				"prose-lead:font-headlines prose-lead:antialiased",
				"prose-lead:text-2xl prose-lead:leading-snug",
				"prose-h1:text-4xl",
				"prose-h2:text-3xl",
				"prose-h3:text-2xl",
				"prose-h4:text-xl",
				"prose-a:focusable",
			)}
		>
			<Component
				components={{
					h1: ({ className, ...props }) => (
						<h2 className={cn("scroll-m-32", className)} {...props} />
					),
					h2: ({ className, ...props }) => (
						<h3 className={cn("scroll-m-32", className)} {...props} />
					),
					h3: ({ className, ...props }) => (
						<h4 className={cn("scroll-m-32", className)} {...props} />
					),
					h4: ({ className, ...props }) => (
						<h5 className={cn("scroll-m-32", className)} {...props} />
					),
					h5: ({ className, ...props }) => (
						<h6 className={cn("scroll-m-32", className)} {...props} />
					),
					h6: ({ className, ...props }) => (
						<h6 className={cn("scroll-m-32", className)} {...props} />
					),
					blockquote: ({ className, ...props }) => (
						<blockquote
							className={cn(
								"not-prose",
								"mt-6 border-l-2 border-grayMed pl-6 italic [&>*]:text-grayDark",
								className,
							)}
							{...props}
						/>
					),
					img: ({
						className,
						alt,
						...props
					}: React.ImgHTMLAttributes<HTMLImageElement>) => (
						// biome-ignore lint/a11y/useAltText: <explanation>
						<img
							alt={alt}
							className={cn(
								"max-w-full border border-grayLight shadow-lg shadow-black/5 dark:shadow-black/50",
								className,
							)}
							{...props}
						/>
					),
					hr: ({ ...props }) => <hr {...props} />,
					table: ({
						className,
						...props
					}: React.HTMLAttributes<HTMLTableElement>) => (
						<div className="my-6 w-full overflow-y-auto">
							<table className={cn("w-full", className)} {...props} />
						</div>
					),
					tr: ({
						className,
						...props
					}: React.HTMLAttributes<HTMLTableRowElement>) => (
						<tr
							className={cn(
								"m-0 border-t border-grayLight p-0 even:bg-grayUltraLight",
								className,
							)}
							{...props}
						/>
					),
					th: ({ className, ...props }) => (
						<th
							className={cn(
								"border border-grayLight px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
								className,
							)}
							{...props}
						/>
					),
					td: ({ className, ...props }) => (
						<td
							className={cn(
								"border border-grayLight px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
								className,
							)}
							{...props}
						/>
					),
					Image,
					CollapsableSection: ({ className, ...props }) => (
						<CollapsableSection
							className={cn("not-prose", className)}
							{...props}
						/>
					),
				}}
			/>
		</div>
	);
}
