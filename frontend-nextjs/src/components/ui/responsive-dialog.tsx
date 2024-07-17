"use client";

import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import {
	type PropsWithChildren,
	type ReactNode,
	useEffect,
	useRef,
	useState,
} from "react";

export function ResponsiveModal({
	children,
	title,
	description,
	footer,
	onClose = () => {},
	onUnmountEnd = () => {},
	initialOpen = false,
}: PropsWithChildren<{
	initialOpen?: boolean;
	title?: ReactNode;
	description?: ReactNode;
	footer?: ReactNode;
	onClose?: () => void;
	onUnmountEnd?: (open: boolean) => void;
}>) {
	const [snap, setSnap] = useState<number | string | null>(1);
	const [open, setOpen] = useState(initialOpen);
	const unmountRef = useRef<NodeJS.Timeout | undefined>(undefined);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (open) return;
		clearTimeout(unmountRef.current);
		setTimeout(() => {
			onUnmountEnd(open);
		}, 300);
		return () => {
			clearTimeout(unmountRef.current);
		};
	}, [open]);

	return (
		<Drawer
			open={open}
			onOpenChange={(open: unknown) => {
				if (open) return;
				onClose();
				setOpen(false);
			}}
			direction="bottom"
			snapPoints={[1]}
			activeSnapPoint={snap}
			setActiveSnapPoint={setSnap}
		>
			<DrawerContent>
				{(title || description) && (
					<DrawerHeader className="text-left">
						{title && <DrawerTitle>{title}</DrawerTitle>}
						{description && (
							<DrawerDescription>{description}</DrawerDescription>
						)}
					</DrawerHeader>
				)}
				<div className="overflow-x-clip overflow-y-auto">{children}</div>
				{footer && <DrawerFooter>{footer}</DrawerFooter>}
			</DrawerContent>
		</Drawer>
	);
}
