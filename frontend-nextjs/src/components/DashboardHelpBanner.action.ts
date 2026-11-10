"use server";

import { cookies } from "next/headers";
import { dashboardHelpBannerExpandedCookieName } from "./DashboardHelpBanner.server";

export async function setDashboardHelpBannerExpandedState(isExpanded: boolean) {
	const cookieStore = await cookies();
	cookieStore.set(
		dashboardHelpBannerExpandedCookieName,
		isExpanded ? "true" : "false",
	);
}
