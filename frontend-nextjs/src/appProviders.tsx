"use client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { endOfDay, startOfDay, subDays, subMonths } from "date-fns";
import CommonProviders from "./commonProviders";
import CustomQueryClientProvider from "./components/QueryClientProvider";
import { FiltersStoreProvider } from "./providers/FiltersStoreProvider";
import { TodayProvider } from "./providers/TodayProvider";
import { UiStoreProvider } from "./providers/UiStoreProvider";
import { getDefaultInitState } from "./stores/filtersStore";

function Providers({
	children,
	today,
}: { children: React.ReactNode; today: Date }) {
	return (
		<CustomQueryClientProvider>
			<FiltersStoreProvider
				today={today}
				initialState={{
					...getDefaultInitState(today),
					defaultFrom: startOfDay(subMonths(startOfDay(today), 2)),
					defaultTo: endOfDay(subDays(today, 1)),
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
