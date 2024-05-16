"use client";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import CustomQueryClientProvider from "./components/QueryClientProvider";
import { Toaster } from "./components/ui/sonner";
import { FiltersStoreProvider } from "./providers/FiltersStoreProvider";

function Providers({ children }: { children: React.ReactNode }) {
	return (
		<>
			<CustomQueryClientProvider>
				<FiltersStoreProvider>
					<ThemeProvider defaultTheme="system" enableSystem>
						<TooltipProvider>
							{children}
							<ReactQueryDevtools initialIsOpen={false} />
						</TooltipProvider>
					</ThemeProvider>
				</FiltersStoreProvider>
			</CustomQueryClientProvider>
			<Toaster />
		</>
	);
}

export default Providers;
