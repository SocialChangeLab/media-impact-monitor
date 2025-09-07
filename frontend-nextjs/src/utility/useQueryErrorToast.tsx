import { useEffect } from "react";
import slugify from "slugify";
import { toast } from "sonner";
import { parseErrorMessage } from "./errorHandlingUtil";
import { texts } from "./textUtil";

function useQueryErrorToast(
	chartName: string,
	error?: string | Error | null | undefined,
) {
	useEffect(() => {
		if (!error || !chartName) return;
		const { message, details } = parseErrorMessage(error);
		toast.error(texts.errors.errorLoadingChartData({ chartName }), {
			id: slugify(message, { lower: true, strict: true }),
			important: true,
			dismissible: true,
			duration: 1000000,
			closeButton: true,
			description: details || message,
		});
	}, [error, chartName]);
}

export default useQueryErrorToast;
