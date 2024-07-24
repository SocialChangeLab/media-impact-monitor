import { useEffect } from "react";
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
		toast.error(`Error fetching ${chartName}`, {
			important: true,
			dismissible: true,
			duration: 1000000,
			closeButton: true,
			description: message,
		});
	}, [error]);
}

export default useQueryErrorToast;
