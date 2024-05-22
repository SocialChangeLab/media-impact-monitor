export async function fetchApiData({
	endpoint,
	body,
	fallbackFilePathContent,
}: {
	endpoint: string;
	body: Record<string, unknown>;
	fallbackFilePathContent: unknown;
}) {
	const apiUrl = process.env.NEXT_PUBLIC_API_URL;
	if (!apiUrl)
		throw new Error("NEXT_PUBLIC_API_URL env variable is not defined");
	let json: unknown = { query: {}, data: [] };
	try {
		const response = await Promise.race([
			fetch(`${apiUrl}/${endpoint}`, {
				cache: "no-store",
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Cache-Control": "no-cache",
				},
				body: JSON.stringify(body),
			}),
			new Promise<Error>((resolve) =>
				setTimeout(() => resolve(new Error("ApiFetchTimeoutError")), 2000),
			),
		]);

		if (response instanceof Error) {
			throw new Error(`ApiFetchTimeoutError`);
		}

		if (!response.ok) {
			const message = `An error has occured: ${response.statusText} ${response.status}`;
			throw new Error(`ApiFetchError&&&${message}`);
		}

		json = await response.json();
	} catch (error) {
		json = fallbackFilePathContent;
	}
	return json;
}
