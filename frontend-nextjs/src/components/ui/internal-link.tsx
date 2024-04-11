import { cn } from '@utility/classNames'
import Link, { LinkProps } from 'next/link'
import React from 'react'

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
				`bg-alt/20 [text-decoration-skip-ink:none]`,
				`hover:bg-alt`,
				`decoration-alt`,
				`transition-colors motion-reduce:transition-none`,
				props.className,
			)}
		/>
	)
}

export default InternalLink
