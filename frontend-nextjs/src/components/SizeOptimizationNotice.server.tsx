import { cookies } from "next/headers";
import { setSizeOptimizationNoticeDisplayedState } from "./SizeOptimizationNotice.action";
import SizeOptimizationNotice from "./SizeOptimizationNotice.client";

export const sizeOptimizationNoticeDisplayedCookieName =
	"size-optimization-notice-is-displayed";

async function SizeOptimizationNoticeServer() {
	const cookieStore = await cookies();
	const { value: isDisplayed } =
		cookieStore.get(sizeOptimizationNoticeDisplayedCookieName) || {};
	return (
		<SizeOptimizationNotice
			defaultIsDisplayed={
				typeof isDisplayed === "undefined" ? true : isDisplayed === "true"
			}
			persistIsDisplayed={setSizeOptimizationNoticeDisplayedState}
		/>
	);
}

export default SizeOptimizationNoticeServer;
