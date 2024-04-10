import { BaseLayout } from '@components/BaseLayout'
export default function NotFound() {
	return (
		<BaseLayout currentPage="events">
			<h1 className="text-3xl font-bold font-headlines antialiased w-full h-full flex place-content-center">
				Page not found
			</h1>
		</BaseLayout>
	)
}
