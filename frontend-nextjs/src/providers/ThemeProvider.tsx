"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps): JSX.Element {
	const Provider = NextThemesProvider as (props: ThemeProviderProps) => JSX.Element;
	return <Provider {...props}>{children}</Provider>;
}
