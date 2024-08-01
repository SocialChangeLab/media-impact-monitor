"use client";
import ThemeToggle from "@/components/ThemeToggle";
import AppLogo from "@/components/logos/AppLogo";
import { cn } from "@/utility/classNames";
import useMediaQuery from "@custom-react-hooks/use-media-query";
import { MenuIcon } from "lucide-react";
import { memo, useEffect, useState } from "react";
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
};

const menuItems: MenuItemType[] = [
	{
		name: "home",
		label: "Home",
		route: "/",
		showMediaFilter: false,
		showOrganisationsFilter: false,
		showTimeFilter: false,
	},
	{
		name: "dashboard",
		label: "Dashboard",
		route: "/dashboard",
		showMediaFilter: true,
		showOrganisationsFilter: true,
		showTimeFilter: true,
	},
	{
		name: "organisations",
		label: "Organisations",
		route: "/organisations",
		showTimeFilter: true,
		showOrganisationsFilter: true,
	},
	{
		name: "about",
		label: "About",
		route: "/about",
	},
	{
		name: "docs",
		label: "Docs",
		route: "/docs",
	},
];

function getMenuItemByPathname(pathname: string) {
	return menuItems.find((i) => i.route === pathname);
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
			className={cn(
				`flex-col md:flex-row md:gap-4 items-center`,
				`hidden lg:flex`,
			)}
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
	const isDesktop = useMediaQuery("(min-width: 1024px)");
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	useEffect(() => {
		isDesktop && setIsMenuOpen(false);
	}, [isDesktop]);

	return (
		<nav
			className={cn(
				"px-[clamp(1rem,2vmax,4rem)] py-4 flex gap-6 flex-wrap items-center justify-between",
				"border-b border-grayLight w-screen overflow-clip z-50 relative",
				`max-w-page mx-auto maxPage:border-x maxPage:border-grayLight bg-bg z-50`,
			)}
		>
			<InternalLink
				href="/"
				title="Home"
				className={cn(
					"opacity-100 motion-safe:transition-opacity hover:opacity-80 focusable",
					"flex items-center lg:items-start gap-3",
				)}
			>
				<AppLogo /> <span className="text-grayDark text-sm">alpha</span>
			</InternalLink>
			<DesktopNavigation menuItems={menuItems} currentPage={currentPage} />
			<MobileNavigation
				menuItems={menuItems}
				currentPage={currentPage}
				isOpened={isMenuOpen}
				onOpenChange={setIsMenuOpen}
			/>
		</nav>
	);
}

export default memo(HeaderMenu);
