import { cn } from '@utility/classNames'
import Link from 'next/link'
import { ReactNode } from 'react'

function HeaderMenuLink({
	as = Link,
	onClick,
	href,
	title,
	className,
	active,
	ariaLabel,
}: {
	as?: typeof Link | string
	onClick?: () => void
	href?: string
	title: ReactNode
	ariaLabel?: string
	className?: string
	active?: boolean
}) {
	const Tag = as
	return (
		<li className="inline-block w-full sm:w-auto">
			<Tag
				href={href ?? '/'}
				aria-label={`Header menu link: ${ariaLabel || title} page`}
				className={cn(
					`py-1.5 px-4 motion-safe:transition-colors`,
					`inline-block border border-transparent`,
					`focusable`,
					!active &&
						`text-grayDark hover:bg-grayUltraLight hover:border-grayLight hover:text-fg`,
					active &&
						`bg-pattern-semi-inverted text-bg hover:text-bg hover:bg-pattern-semi-inverted cursor-default`,
					className,
				)}
				tabIndex={active ? -1 : 0}
				onClick={onClick}
			>
				{title}
			</Tag>
		</li>
	)
}

export default HeaderMenuLink
