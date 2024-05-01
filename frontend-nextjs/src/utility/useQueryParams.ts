'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'
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
			router.push(`${pathname}?${combinedParams.toString()}`)
		},
		[originalSearchParams, pathname, router],
	)

	const searchParams = useMemo(
		() => parseSearchParams(originalSearchParams),
		[originalSearchParams],
	)

	return {
		searchParams,
		setSearchParams,
	}
}

export default useQueryParams
