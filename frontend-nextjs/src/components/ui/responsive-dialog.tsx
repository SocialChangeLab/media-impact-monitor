"use client";

import { cn } from "@/utility/classNames";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
	type ReactNode,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";

type Destination = "overview" | "individual-page";

export function ResponsiveModal({
	children,
	id,
	basePath,
}: {
	children: ReactNode;
	id?: string;
	basePath: string;
}) {
	const pathname = usePathname();
	const router = useRouter();

	const show = !!id && pathname.startsWith(basePath);
	const lastShow = useRef(show);
	const [isOpen, setIsOpen] = useState(show);

	const searchParams = useSearchParams();

	useEffect(() => {
		if (show !== lastShow.current) {
			setIsOpen(show);
			lastShow.current = show;
		}
	}, [show]);

	const onClose = useCallback(() => {
		if (lastShow.current) {
			const backLink = searchParams.get("backLink");
			const newSearchParams = new URLSearchParams(searchParams);
			newSearchParams.set("backLink", `${basePath}${id}`);
			if (typeof backLink === "string" && backLink.startsWith("/")) {
				router.push(`${backLink}?${newSearchParams.toString()}`);
			} else {
				const validatedBasePath =
					basePath === "/events/" ? "/" : basePath.replace(/\/$/, "");
				router.push(`${validatedBasePath}?${newSearchParams.toString()}`);
			}
			lastShow.current = false;
		}
	}, [router, searchParams, id, basePath]);

	return (
		<AnimatePresence onExitComplete={() => onClose()}>
			{isOpen && (
				<>
					<motion.button
						type="button"
						onClick={() => setIsOpen(false)}
						onKeyDown={(e) => {
							if (e.key === "Escape" || e.key === "Esc") {
								setIsOpen(false);
							}
						}}
						initial="initial"
						animate="animate"
						exit="iniial"
						variants={{
							initial: { opacity: 0 },
							animate: { opacity: 1 },
						}}
						transition={{
							duration: 0.3,
							ease: "circInOut",
						}}
						className="fixed inset-0 z-50 bg-bgOverlay"
					/>
					<motion.dialog
						open
						initial={{ transform: "translateY(100%)" }}
						animate={{ transform: "translateY(0%)" }}
						exit={{ transform: "translateY(100%)" }}
						className={cn(
							"w-screen h-screen fixed inset-0 top-auto z-50 bg-transparent",
							"overflow-x-hidden overflow-y-auto pointer-events-none",
						)}
					>
						<div className="bg-bg rounded-t-lg mt-56 w-screen h-auto pointer-events-auto min-h-full">
							{children}
						</div>
					</motion.dialog>
				</>
			)}
		</AnimatePresence>
	);
}

function getDestinaiton(pathname: string, basePath: string): Destination {
	if (pathname.startsWith(basePath)) return "overview";
	return "individual-page";
}
