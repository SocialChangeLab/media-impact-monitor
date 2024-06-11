"use client";

import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import { type PropsWithChildren, type ReactNode, useState } from "react";

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
	const [snap, setSnap] = useState<number | string | null>(1);
	return (
		<Drawer
			open={open}
			onOpenChange={(open: unknown) => !open && onClose && onClose()}
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
