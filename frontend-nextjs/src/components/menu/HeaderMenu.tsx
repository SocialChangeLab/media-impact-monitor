import ThemeToggle from "@/components/ThemeToggle";
import AppLogo from "@/components/logos/AppLogo";
import { cn } from "@/utility/classNames";
import Link from "next/link";
import { memo } from "react";
import HeaderMenuLink from "./HeaderMenuLink";

type MenuItemType = {
	name: string;
	label?: string;
	route?: string;
};

const menuItems: MenuItemType[] = [
	{
		name: "dashboard",
		label: "Dashboard",
		route: "/",
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
function HeaderMenu({ currentPage }: { currentPage: string }) {
	return (
		<nav
			className={cn(
				"px-[clamp(1rem,2vmax,4rem)] py-4 flex gap-6 flex-wrap items-center justify-between",
				"border-b border-grayLight w-screen overflow-clip",
				`max-w-page mx-auto 2xl:border-x border-grayLight`,
			)}
		>
			<Link
				href="/"
				title="Home"
				className={cn(
					"opacity-100 motion-safe:transition-opacity hover:opacity-80 focusable",
					"flex items-start gap-3",
				)}
			>
				<AppLogo /> <span className="text-grayDark text-sm">alpha</span>
			</Link>
			<ul
				className={cn(`flex flex-col md:flex-row md:gap-4 items-center`)}
				aria-label="Main menu items"
			>
				{menuItems.map((item) => (
					<HeaderMenuLink
						key={item.name}
						href={item.route ?? "/"}
						title={item.label ?? "-"}
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
		</nav>
	);
}

export default memo(HeaderMenu);
