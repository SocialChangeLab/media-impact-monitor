import { useEffect } from "react";
import slugify from "slugify";
import { toast } from "sonner";
import { parseErrorMessage } from "./errorHandlingUtil";

function useQueryErrorToast(
	chartName: string,
	error?: string | Error | null | undefined,
) {
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!error || !chartName) return;
		const { message, details } = parseErrorMessage(error);
		toast.error(`Error fetching the ${chartName} data`, {
			id: slugify(message, { lower: true, strict: true }),
			important: true,
			dismissible: true,
			duration: 1000000,
			closeButton: true,
			description: message,
		});
	}, [error]);
}

export default useQueryErrorToast;
