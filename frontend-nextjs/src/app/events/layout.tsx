import { Layout as BaseLayout } from '@components/layout'
import { PropsWithChildren } from 'react'

export default async function Layout({ children }: PropsWithChildren<{}>) {
	return <BaseLayout currentPage="blog_posts">{children}</BaseLayout>
}
