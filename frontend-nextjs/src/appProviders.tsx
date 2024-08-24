"use client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { endOfDay, startOfDay, subDays, subMonths } from "date-fns";
import CommonProviders from "./commonProviders";
import CustomQueryClientProvider from "./components/QueryClientProvider";
import { FiltersStoreProvider } from "./providers/FiltersStoreProvider";
import { TodayProvider } from "./providers/TodayProvider";
import { UiStoreProvider } from "./providers/UiStoreProvider";
import { defaultInitState } from "./stores/filtersStore";

function Providers({
	children,
	today,
}: { children: React.ReactNode; today: Date }) {
	return (
		<CustomQueryClientProvider>
			<FiltersStoreProvider
				initialState={{
					...defaultInitState,
					defaultTo: endOfDay(subDays(today, 1)),
					defaultFrom: startOfDay(subMonths(startOfDay(today), 2)),
				}}
			>
				<TodayProvider value={today}>
					<UiStoreProvider>
						<CommonProviders>{children}</CommonProviders>
						<ReactQueryDevtools initialIsOpen={false} />
					</UiStoreProvider>
				</TodayProvider>
			</FiltersStoreProvider>
		</CustomQueryClientProvider>
	);
}

export default Providers;
