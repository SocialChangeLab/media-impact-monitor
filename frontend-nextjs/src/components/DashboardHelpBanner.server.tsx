import { cookies } from "next/headers";
import { setDashboardHelpBannerExpandedState } from "./DashboardHelpBanner.action";
import DashboardHelpBannerClient from "./DashboardHelpBanner.client";

export const dashboardHelpBannerExpandedCookieName =
	"dashboard-help-banner-is-expanded";

function DashboardHelpBannerServer() {
	const cookieStore = cookies();
	const { value: isExpanded } =
		cookieStore.get(dashboardHelpBannerExpandedCookieName) || {};
	return (
		<DashboardHelpBannerClient
			defaultIsExpanded={
				typeof isExpanded === "undefined" ? false : isExpanded === "true"
			}
			persistIsExpanded={setDashboardHelpBannerExpandedState}
		/>
	);
}

export default DashboardHelpBannerServer;
