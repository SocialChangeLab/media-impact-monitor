"use client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import CommonProviders from "./commonProviders";
import CustomQueryClientProvider from "./components/QueryClientProvider";
import { FiltersStoreProvider } from "./providers/FiltersStoreProvider";
import { UiStoreProvider } from "./providers/UiStoreProvider";

function Providers({ children }: { children: React.ReactNode }) {
	return (
		<CustomQueryClientProvider>
			<FiltersStoreProvider>
				<UiStoreProvider>
					<CommonProviders>{children}</CommonProviders>
					<ReactQueryDevtools initialIsOpen={false} />
				</UiStoreProvider>
			</FiltersStoreProvider>
		</CustomQueryClientProvider>
	);
}

export default Providers;
