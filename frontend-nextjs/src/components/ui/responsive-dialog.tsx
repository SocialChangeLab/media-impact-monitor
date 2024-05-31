"use client";
import type * as React from "react";

import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";

export function ResponsiveModal({
	children,
	title,
	description,
	footer,
	onClose,
	open,
}: React.PropsWithChildren<{
	open: boolean;
	title?: React.ReactNode;
	description?: React.ReactNode;
	footer?: React.ReactNode;
	onClose?: () => void;
}>) {
	return (
		<Drawer
			open={open}
			onOpenChange={(open: unknown) => !open && onClose && onClose()}
			direction="bottom"
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
				{children}
				{footer && <DrawerFooter>{footer}</DrawerFooter>}
			</DrawerContent>
		</Drawer>
	);
}
