'use client'
import {
	QueryClient,
	QueryClientProvider as TanstackQueryClientProvider,
} from '@tanstack/react-query'
import { PropsWithChildren } from 'react'

export const queryClient = new QueryClient()

function QueryClientProvider({ children }: PropsWithChildren<{}>) {
	return (
		<TanstackQueryClientProvider client={queryClient}>
			{children}
		</TanstackQueryClientProvider>
	)
}

export default QueryClientProvider
