"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, useRef } from "react";

function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				// With SSR, we usually want to set some default staleTime
				// above 0 to avoid refetching immediately on the client
				staleTime: 60 * 1000,
			},
		},
	});
}

function CustomQueryClientProvider({
	children,
}: { children: React.ReactNode }) {
	const queryClient = useRef(makeQueryClient());
	return (
		<Suspense>
			<QueryClientProvider client={queryClient.current}>
				{children}
			</QueryClientProvider>
		</Suspense>
	);
}

export default CustomQueryClientProvider;
