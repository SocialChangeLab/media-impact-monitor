import { format, parse } from 'date-fns'
export type AllowedParamsInputType = {
	from?: Date | undefined
	to?: Date | undefined
}

export const allowedParamKeys: (keyof AllowedParamsInputType)[] = [
	'from',
	'to',
] as const

export function parseSearchParams(
	originalSearchParams: URLSearchParams,
): AllowedParamsInputType {
	const from = originalSearchParams.get('from')
	const to = originalSearchParams.get('to')
	if (typeof from !== 'string' || typeof to !== 'string') return {}
	return {
		from: parse(from, 'yyyy-MM-dd', new Date()),
		to: parse(to, 'yyyy-MM-dd', new Date()),
	}
}

export function formatSearchParams(
	searchParams: AllowedParamsInputType,
): URLSearchParams {
	if (!searchParams.from || !searchParams.to) return new URLSearchParams()
	return new URLSearchParams({
		from: format(searchParams.from, 'yyyy-MM-dd'),
		to: format(searchParams.to, 'yyyy-MM-dd'),
	})
}
