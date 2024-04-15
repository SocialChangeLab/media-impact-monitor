import { AnimationProps } from 'framer-motion'

export const fadeVariants: AnimationProps['variants'] = {
	initial: { opacity: 0 },
	enter: { opacity: 1 },
}
