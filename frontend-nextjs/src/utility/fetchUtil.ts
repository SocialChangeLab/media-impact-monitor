export async function fetchApiData({
	endpoint,
	body,
	fallbackFilePathContent,
}: {
	endpoint: string;
	body: Record<string, unknown>;
	fallbackFilePathContent?: unknown;
}) {
	const apiUrl = process.env.NEXT_PUBLIC_API_URL;
	if (!apiUrl)
		throw new Error("NEXT_PUBLIC_API_URL env variable is not defined");
	const response = await fetch(`${apiUrl}/${endpoint}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
		next: {
			revalidate: 3600 * 4,
		},
	});

	if (!response.ok) {
		const message = `An error has occured: ${response.statusText} ${response.status}`;
		throw new Error(`ApiFetchError&&&${message}`);
	}

	// Check if the response is a success
	if (response.status >= 200 && response.status < 300) {
		return await response.json();
	}

	throw new Error(`ApiFetchError&&&${response.statusText}`);
}
