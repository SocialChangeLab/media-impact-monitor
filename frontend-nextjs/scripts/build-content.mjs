import { compile } from '@mdx-js/mdx'
import matter from 'gray-matter'
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import slugify from 'slugify'

const appDir = fileURLToPath(new URL('../', import.meta.url))

export async function buildContent({
 contentDir = path.join(appDir, 'src/content'),
 outputFile = path.join(appDir, 'src/generated/docs.json'),
} = {}) {
 async function collect(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  return (await Promise.all(entries.map(entry => entry.isDirectory()
   ? collect(path.join(dir, entry.name))
   : entry.name.endsWith('.mdx') ? [path.join(dir, entry.name)] : []))).flat().sort()
 }
 const files = await collect(contentDir)
 const docs = await Promise.all(files.map(async file => {
  const { data, content } = matter(await readFile(file, 'utf8'))
  const id = path.relative(contentDir, file).split(path.sep).join('/')
  if (typeof data.title !== 'string' || !data.title.trim()
   || !(typeof data.date === 'string' || data.date instanceof Date)
   || !Number.isFinite(new Date(data.date).getTime())
   || (data.tocOrder !== undefined && !Number.isFinite(data.tocOrder))) {
   throw new Error(`Invalid documentation frontmatter: ${id}`)
  }
  const compiled = await compile({ value: content, path: file }, {
   outputFormat: 'function-body',
   remarkPlugins: [remarkGfm],
   rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, {
    properties: { className: ['subheading-anchor'], ariaLabel: 'Link to section' },
   }]],
  })
  return {
   _id: id,
   _raw: { flattenedPath: id.replace(/\.mdx$/, '') },
   title: data.title,
   date: new Date(data.date).toISOString(),
   tocOrder: data.tocOrder ?? 999,
   slug: slugify(data.title, { lower: true, strict: true }),
   body: { raw: content, code: String(compiled) },
  }
 }))
 if (!docs.length) throw new Error(`No MDX documents found in ${contentDir}`)
 const json = `${JSON.stringify(docs, null, 2)}\n`
 await mkdir(path.dirname(outputFile), { recursive: true })
 // Avoid invalidating Next's watcher when no source content changed.
 const previous = await readFile(outputFile, 'utf8').catch(error => {
  if (error.code !== 'ENOENT') throw error
  return null
 })
 if (previous !== json) await writeFile(outputFile, json)
 return docs
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
 const docs = await buildContent()
 console.log(`Compiled ${docs.length} MDX documents`)
}
