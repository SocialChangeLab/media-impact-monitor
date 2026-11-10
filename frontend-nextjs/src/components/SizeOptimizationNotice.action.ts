"use server";

import { cookies } from "next/headers";
import { sizeOptimizationNoticeDisplayedCookieName } from "./SizeOptimizationNotice.server";

export async function setSizeOptimizationNoticeDisplayedState(
	isDisplayed: boolean,
) {
	const cookieStore = await cookies();
	cookieStore.set(
		sizeOptimizationNoticeDisplayedCookieName,
		isDisplayed ? "true" : "false",
	);
}
