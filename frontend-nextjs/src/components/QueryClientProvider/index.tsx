"use client";
import {
	QueryClient,
	QueryClientProvider as TanstackQueryClientProvider,
} from "@tanstack/react-query";

export const queryClient = new QueryClient();

function EventPageLayout({ children }: { children: React.ReactNode }) {
	return (
		<TanstackQueryClientProvider client={queryClient}>
			{children}
		</TanstackQueryClientProvider>
	);
}

export default EventPageLayout;
