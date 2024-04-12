import { isBefore, parse } from '@formkit/tempo'
export function dateSortCompare(a: unknown, b: unknown): 0 | -1 | 1 {
	if (typeof a !== 'string' || typeof b !== 'string') return 0
	try {
		const dateA = parse(a)
		const dateB = parse(b)
		if (isBefore(dateA, dateB)) return -1
		else if (isBefore(dateB, dateA)) return 1
		return 0
	} catch (error) {
		return 0
	}
}

export function isValidISODateString(date?: unknown) {
	if (typeof date !== 'string') return false
	try {
		parse(date)
		return true
	} catch (error) {
		return false
	}
}
