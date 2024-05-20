import { cn } from "@/utility/classNames";
import type { LinkProps } from "next/link";
import Link from "next/link";
import type React from "react";

function InternalLink(
	props: LinkProps & { className?: string; children?: React.ReactNode },
) {
	return (
		<Link
			{...props}
			className={cn(
				`underline underline-offset-4 decoration-wavy`,
				`decoration-clone leading-relaxed hyphen-auto dark:decoration-from-font`,
				`outline-none focusable rounded-full -ml-3 px-3 pt-2 pb-1.5`,
				`bg-grayLight/20 [text-decoration-skip-ink:none]`,
				`hover:bg-grayLight`,
				`decoration-grayLight`,
				`transition-colors motion-reduce:transition-none`,
				props.className,
			)}
		/>
	);
}

export default InternalLink;
