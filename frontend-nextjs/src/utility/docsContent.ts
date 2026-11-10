import docs from '@/generated/docs.json'

export type DocsPage = (typeof docs)[number]
export const allDocsPages: DocsPage[] = docs
