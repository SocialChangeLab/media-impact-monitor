"use client";

import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import { useState, type PropsWithChildren, type ReactNode } from "react";

export function ResponsiveModal({
	children,
	title,
	description,
	footer,
	onClose,
	open,
}: PropsWithChildren<{
	open: boolean;
	title?: ReactNode;
	description?: ReactNode;
	footer?: ReactNode;
	onClose?: () => void;
}>) {
	const [snap, setSnap] = useState<number | string | null>(0.7);
	return (
		<Drawer
			open={open}
			onOpenChange={(open: unknown) => !open && onClose && onClose()}
			direction="bottom"
			snapPoints={[0.45, 0.8]}
			activeSnapPoint={snap}
			setActiveSnapPoint={setSnap}
		>
			<DrawerContent tabIndex={-1} className="focusable">
				{(title || description) && (
					<DrawerHeader className="text-left">
						{title && <DrawerTitle>{title}</DrawerTitle>}
						{description && (
							<DrawerDescription>{description}</DrawerDescription>
						)}
					</DrawerHeader>
				)}
				{children}
				{footer && <DrawerFooter>{footer}</DrawerFooter>}
			</DrawerContent>
		</Drawer>
	);
}
