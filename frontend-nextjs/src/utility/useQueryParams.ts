'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import {
	AllowedParamsInputType,
	formatSearchParams,
	parseSearchParams,
} from './searchParamsUtil'

type UseQueryParamsOutputType = {
	searchParams: AllowedParamsInputType
	setSearchParams: (params: Partial<AllowedParamsInputType>) => void
}

function useQueryParams(): UseQueryParamsOutputType {
	const pathname = usePathname()
	const originalSearchParams = useSearchParams()
	const router = useRouter()

	const setSearchParams = useCallback(
		(params: Partial<AllowedParamsInputType>) => {
			const combinedParams = formatSearchParams({
				...Object.fromEntries(originalSearchParams.entries()),
				...params,
			})
			router.push(`${pathname}?${combinedParams.toString()}`, {
				scroll: false,
			})
		},
		[originalSearchParams, pathname, router],
	)

	return {
		searchParams: parseSearchParams(originalSearchParams),
		setSearchParams,
	}
}

export default useQueryParams
