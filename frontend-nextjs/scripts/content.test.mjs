import assert from 'node:assert/strict'
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import * as runtime from 'react/jsx-runtime'
import { runSync } from '@mdx-js/mdx'
import matter from 'gray-matter'
import { buildContent } from './build-content.mjs'

const contentDir = path.resolve('src/content')
async function mdxFiles(dir) {
 const entries = await readdir(dir, { withFileTypes: true })
 return (await Promise.all(entries.map(entry => entry.isDirectory()
  ? mdxFiles(path.join(dir, entry.name))
  : entry.name.endsWith('.mdx') ? [path.join(dir, entry.name)] : []))).flat().sort()
}

test('every source document survives compilation and renders with heading anchors', async () => {
 const docs = await buildContent()
 const files = await mdxFiles(path.join(contentDir, 'docs'))
 assert.equal(docs.length, files.length)
 assert.equal(new Set(docs.map(doc => doc._id)).size, files.length)
 for (const file of files) {
  const source = matter(await readFile(file, 'utf8'))
  const doc = docs.find(doc => doc._id === path.relative(contentDir, file))
  assert.ok(doc, file)
  assert.equal(doc.body.raw, source.content, file)
  assert.equal(doc.title, source.data.title, file)
  assert.equal(doc.date, new Date(source.data.date).toISOString(), file)
  assert.equal(doc.tocOrder, source.data.tocOrder ?? 999, file)
  assert.equal(doc._raw.flattenedPath, path.relative(contentDir, file).replace(/\.mdx$/, ''))
  const Component = runSync(doc.body.code, runtime).default
  const html = renderToStaticMarkup(createElement(Component))
  assert.ok(html.length > 0, file)
  if (/^#{1,6} /m.test(source.content)) {
   assert.match(html, /id="[^"]+"/, file)
   assert.match(html, /class="subheading-anchor"/, file)
  }
 }
 const generated = JSON.parse(await readFile('src/generated/docs.json', 'utf8'))
 assert.deepEqual(generated, docs)
})

test('invalid frontmatter fails loudly with the source path', async () => {
 const dir = await mkdtemp(path.join(os.tmpdir(), 'mim-content-'))
 try {
  for (const frontmatter of ['date: 2024-01-01', 'title: Test\ndate: nonsense', 'title: Test\ndate: 2024-01-01\ntocOrder: nonsense']) {
   await writeFile(path.join(dir, 'broken.mdx'), `---\n${frontmatter}\n---\n# Test`)
   await assert.rejects(buildContent({ contentDir: dir, outputFile: path.join(dir, 'out.json') }), /broken.mdx/)
  }
 } finally { await rm(dir, { recursive: true, force: true }) }
})
