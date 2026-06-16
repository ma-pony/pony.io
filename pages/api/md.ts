import type { NextApiRequest, NextApiResponse } from 'next'
import { allBlogs } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'

// Rough token estimate (~4 chars/token). The header is advertised as best-effort
// so agents can budget context before reading the body.
const estimateTokens = (s: string) => Math.ceil(s.length / 4)

// Strip MDX-only noise (import/export statements) so the body reads as plain
// Markdown. We keep everything else as-authored — it's already Markdown.
const toPlainMarkdown = (raw: string) =>
  raw
    .replace(/^\s*(import|export)\s.+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

const day = (d: string) => new Date(d).toISOString().split('T')[0]

function homepageMarkdown(): string {
  const posts = [...allBlogs]
    .filter((p) => !p.draft && !p.noindex)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, 30)
  const list = posts
    .map(
      (p) =>
        `- [${p.title}](${siteMetadata.siteUrl}/blog/${p.slug}) (${day(p.date)})${
          p.summary ? `: ${p.summary}` : ''
        }`
    )
    .join('\n')
  return `# ${siteMetadata.title}

> ${siteMetadata.seoDescription || siteMetadata.description}

作者:${siteMetadata.author}

## 最新文章

${list}
`
}

function postMarkdown(slug: string): string | null {
  const post = allBlogs.find((p) => p.slug === slug && !p.draft)
  if (!post) return null
  const header = [
    `# ${post.title}`,
    '',
    post.summary ? `> ${post.summary}` : '',
    '',
    `- 发布:${day(post.date)}`,
    post.tags && post.tags.length ? `- 标签:${post.tags.join(', ')}` : '',
    `- 原文:${siteMetadata.siteUrl}/blog/${post.slug}`,
    '',
    '---',
    '',
  ]
    .filter((line) => line !== '')
    .join('\n')
  return `${header}\n\n${toPlainMarkdown(post.body?.raw || '')}\n`
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // The proxy passes the original path via the x-md-path header (query fallback
  // for direct hits). Defaults to the homepage.
  const headerPath = req.headers['x-md-path']
  const rawPath =
    (typeof headerPath === 'string' && headerPath) ||
    (typeof req.query.path === 'string' && req.query.path) ||
    '/'
  // The path arrives percent-encoded (slugs can contain non-ASCII, e.g. Chinese);
  // decode it so it matches the decoded `post.slug`.
  let path = rawPath
  try {
    path = decodeURIComponent(rawPath)
  } catch {
    /* keep raw on malformed input */
  }

  let body: string | null
  if (path === '/' || path === '') {
    body = homepageMarkdown()
  } else {
    const slug = path.replace(/^\/blog\//, '').replace(/\/$/, '')
    body = postMarkdown(slug)
  }

  // `Vary: Accept` so any cache keeps the markdown and HTML variants separate.
  res.setHeader('Content-Type', 'text/markdown; charset=utf-8')
  res.setHeader('Vary', 'Accept')
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate')

  if (body == null) {
    res.status(404).send(`# 404 Not Found\n\n\`${path}\` 不存在。\n`)
    return
  }
  res.setHeader('x-markdown-tokens', String(estimateTokens(body)))
  res.status(200).send(body)
}
