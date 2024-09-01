import {
	useCallback,
	useEffect,
	useMemo,
	useState,
	type RefObject,
} from 'react'

export function useIsInViewport(ref: RefObject<HTMLElement>) {
	const [isIntersecting, setIsIntersecting] = useState(false)

	const observer = useMemo(() => {
		if (typeof window === 'undefined') return
		return new IntersectionObserver(([entry]) =>
			setIsIntersecting(entry.isIntersecting && entry.intersectionRatio > 0.3),
		)
	}, [])

	const cleanup = useCallback(() => {
		if (!observer) return
		observer.disconnect()
	}, [observer])

	useEffect(() => {
		if (!ref.current || !observer) return cleanup
		observer.observe(ref.current)

		return () => cleanup
	}, [ref, observer, cleanup])

	return isIntersecting
}
