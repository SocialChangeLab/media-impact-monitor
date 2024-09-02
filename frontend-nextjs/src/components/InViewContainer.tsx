import { useIsInViewport } from '@/utility/useIsInViewPort'
import { useRef } from 'react'

function InViewContainer({
	children,
	fallback,
}: {
	children: JSX.Element
	fallback?: JSX.Element
}) {
	const parentRef = useRef<HTMLDivElement>(null)
	const inView = useIsInViewport(parentRef)

	return <div ref={parentRef}>{inView ? children : fallback ?? null}</div>
}

export default InViewContainer
