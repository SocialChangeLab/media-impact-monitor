"use server";

import { cookies } from "next/headers";
import { sizeOptimizationNoticeDisplayedCookieName } from "./SizeOptimizationNotice.server";

export async function setSizeOptimizationNoticeDisplayedState(
	isDisplayed: boolean,
) {
	cookies().set(
		sizeOptimizationNoticeDisplayedCookieName,
		isDisplayed ? "true" : "false",
	);
}
