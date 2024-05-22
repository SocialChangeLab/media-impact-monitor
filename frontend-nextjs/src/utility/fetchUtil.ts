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
		const response = await fetch(`${apiUrl}/${endpoint}`, {
			cache: "no-store",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Cache-Control": "no-cache",
			},
			body: JSON.stringify(body),
		});

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
