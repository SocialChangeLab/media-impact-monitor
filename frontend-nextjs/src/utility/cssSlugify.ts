import slugify from 'slugify'

export function slugifyCssClass(className: string) {
	return slugify(className, {
		lower: true,
		strict: true,
	})
}
