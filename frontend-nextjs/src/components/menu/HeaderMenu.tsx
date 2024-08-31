"use client";
import ThemeToggle from "@/components/ThemeToggle";
import AppLogo from "@/components/logos/AppLogo";
import { cn } from "@/utility/classNames";
import { texts } from "@/utility/textUtil";
import useMediaQuery from "@custom-react-hooks/use-media-query";
import { useAnimationFrame } from "framer-motion";
import { MenuIcon } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import InternalLink from "../InternalLink";
import { Button } from "../ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";
import HeaderMenuLink from "./HeaderMenuLink";

type MenuItemType = {
	name: string;
	label: string;
	route: string;
	showMediaFilter?: boolean;
	showOrganisationsFilter?: boolean;
	showTimeFilter?: boolean;
	cascade?: boolean;
};

const menuItems: MenuItemType[] = [
	{
		name: "home",
		label: texts.mainNavigation.home,
		route: "/",
		showMediaFilter: false,
		showOrganisationsFilter: false,
		showTimeFilter: false,
	},
	{
		name: "dashboard",
		label: texts.mainNavigation.dashboard,
		route: "/dashboard",
		showMediaFilter: true,
		showOrganisationsFilter: true,
		showTimeFilter: true,
	},
	{
		name: "organisations",
		label: texts.mainNavigation.organisations,
		route: "/organisations",
		showTimeFilter: true,
		showOrganisationsFilter: true,
		cascade: true,
	},
	{
		name: "about",
		label: texts.mainNavigation.about,
		route: "/about",
	},
	{
		name: "docs",
		label: texts.mainNavigation.docs,
		route: "/docs",
	},
];

function getMenuItemByPathname(pathname: string) {
	const item = menuItems.find((i) => {
		if (i.route === "/") return pathname === "/";
		return pathname.startsWith(i.route);
	});
	if (!item) return undefined;
	if (item.route === pathname) return item;
	return item.cascade ? item : undefined;
}

export function doesPathnameShowAnyFilter(pathname: string) {
	const menuItem = getMenuItemByPathname(pathname);
	if (!menuItem) return false;
	const showAnyFilter = Boolean(
		menuItem.showMediaFilter ||
			menuItem.showOrganisationsFilter ||
			menuItem.showTimeFilter,
	);
	return showAnyFilter;
}

export function doesPathnameShowMediaFilter(pathname: string) {
	const menuItem = getMenuItemByPathname(pathname);
	if (!menuItem) return false;
	return menuItem.showMediaFilter;
}

export function doesPathnameShowOrganisationsFilter(pathname: string) {
	const menuItem = getMenuItemByPathname(pathname);
	if (!menuItem) return false;
	return menuItem.showOrganisationsFilter;
}

export function doesPathnameShowTimeFilter(pathname: string) {
	const menuItem = getMenuItemByPathname(pathname);
	if (!menuItem) return false;
	return menuItem.showTimeFilter;
}

const MobileNavigation = memo(
	({
		menuItems,
		currentPage,
		isOpened = false,
		onOpenChange,
	}: {
		menuItems: MenuItemType[];
		currentPage: string;
		isOpened?: boolean;
		onOpenChange?: (isOpened: boolean) => void;
	}) => (
		<ul
			className={cn(`flex flex-row-reverse gap-4 items-center lg:hidden`)}
			aria-label="Main menu items"
		>
			<Drawer direction="right" onOpenChange={onOpenChange} open={isOpened}>
				<li aria-label="Main mobile navigation">
					<DrawerTrigger>
						<Button variant="ghost" size="icon">
							<MenuIcon />
						</Button>
					</DrawerTrigger>
				</li>
				<DrawerContent>
					<strong className="text-xl font-headlines font-semibold px-8 py-7">
						Menu
					</strong>
					<ul
						className={cn(`flex flex-col gap-4 p-4`)}
						aria-label="Main menu items"
					>
						{menuItems.map((item) => (
							<HeaderMenuLink
								key={item.name}
								href={item.route}
								title={item.label}
								active={currentPage === item.name}
								onClick={() => onOpenChange?.(false)}
							/>
						))}
					</ul>
				</DrawerContent>
			</Drawer>
			<li aria-label="Main menu link: Other actions">
				<div className="text-fg inline-flex items-center">
					<ThemeToggle />
				</div>
			</li>
		</ul>
	),
);

const DesktopNavigation = memo(
	({
		menuItems,
		currentPage,
	}: { menuItems: MenuItemType[]; currentPage: string }) => (
		<ul
			className={cn(`flex-row gap-2 xl:gap-3 items-center`, `hidden lg:flex`)}
			aria-label="Main menu items"
		>
			{menuItems.map((item) => (
				<HeaderMenuLink
					key={item.name}
					href={item.route}
					title={item.label}
					active={currentPage === item.name}
				/>
			))}
			<li
				aria-label="Main menu link: Other actions"
				className={cn(
					`w-full md:w-auto py-5 md:p-0 text-grayDark`,
					`flex justify-between items-center pr-5 md:pr-0`,
				)}
			>
				<div className="text-fg inline-flex items-center">
					<ThemeToggle />
				</div>
			</li>
		</ul>
	),
);

function HeaderMenu({ currentPage }: { currentPage: string }) {
	const mediaQuery = useMediaQuery("(max-width: 1024px)");
	const [isMobile, setIsMobile] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const mainNavRef = useRef<HTMLElement>(null);

	useEffect(() => {
		!isMobile && setIsMenuOpen(false);
	}, [isMobile]);

	useEffect(() => setIsMobile(mediaQuery), [mediaQuery]);

	useAnimationFrame(() => {
		if (!mainNavRef.current) return;
		const height = mainNavRef.current.getBoundingClientRect().height;
		document.documentElement.style.setProperty(
			"--headerHeight",
			`${Math.floor(height)}px`,
		);
	});

	return (
		<nav
			ref={mainNavRef}
			id="main-navigation"
			className={cn(
				"px-[var(--pagePadding)] py-4 flex gap-6 flex-wrap items-center justify-between",
				"border-b border-grayLight w-screen overflow-clip z-50 relative",
				`max-w-page mx-auto maxPage:border-x maxPage:border-grayLight bg-bg z-50`,
				"pointer-events-auto",
			)}
		>
			<InternalLink
				href="/dashboard"
				title="Home"
				className={cn(
					"opacity-100 motion-safe:transition-opacity hover:opacity-80 focusable",
					"flex items-center lg:items-start gap-3",
				)}
			>
				<AppLogo /> <span className="text-grayDark text-sm">beta</span>
			</InternalLink>
			<DesktopNavigation menuItems={menuItems} currentPage={currentPage} />
			{isMobile && (
				<MobileNavigation
					menuItems={menuItems}
					currentPage={currentPage}
					isOpened={isMenuOpen}
					onOpenChange={setIsMenuOpen}
				/>
			)}
		</nav>
	);
}

export default memo(HeaderMenu);
