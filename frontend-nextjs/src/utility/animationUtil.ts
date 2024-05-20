import type { AnimationProps } from "framer-motion";

export const fadeVariants: AnimationProps["variants"] = {
	initial: { opacity: 0 },
	enter: { opacity: 1 },
};

export const scaleInVariants: AnimationProps["variants"] = {
	initial: { opacity: 0, scale: 0.5 },
	enter: { opacity: 1, scale: 1 },
};
