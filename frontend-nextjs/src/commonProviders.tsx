"use client";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Toaster } from "./components/ui/sonner";

function CommonProviders({ children }: { children: React.ReactNode }) {
	return (
		<>
			<ThemeProvider defaultTheme="system" enableSystem>
				<TooltipProvider>{children}</TooltipProvider>
			</ThemeProvider>
			<Toaster />
		</>
	);
}

export default CommonProviders;
