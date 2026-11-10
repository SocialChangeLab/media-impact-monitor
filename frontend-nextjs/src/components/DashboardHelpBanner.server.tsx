import { cookies } from "next/headers";
import { setDashboardHelpBannerExpandedState } from "./DashboardHelpBanner.action";
import DashboardHelpBannerClient from "./DashboardHelpBanner.client";

export const dashboardHelpBannerExpandedCookieName =
	"dashboard-help-banner-is-expanded";

async function DashboardHelpBannerServer() {
	const cookieStore = await cookies();
	const { value: isExpanded } =
		cookieStore.get(dashboardHelpBannerExpandedCookieName) || {};
	return (
		<DashboardHelpBannerClient
			defaultIsExpanded={
				typeof isExpanded === "undefined" ? true : isExpanded === "true"
			}
			persistIsExpanded={setDashboardHelpBannerExpandedState}
		/>
	);
}

export default DashboardHelpBannerServer;
