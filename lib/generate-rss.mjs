import { writeFileSync, mkdirSync } from 'fs'
import path from 'path'
import { slug } from 'github-slugger'

// Self-contained replacement for pliny <0.2's removed `pliny/utils/generate-rss`.
const escape = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

function rssItem(config, post) {
  return `
    <item>
      <guid>${config.siteUrl}/blog/${post.slug}</guid>
      <title>${escape(post.title)}</title>
      <link>${config.siteUrl}/blog/${post.slug}</link>
      ${post.summary ? `<description>${escape(post.summary)}</description>` : ''}
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <author>${config.email} (${config.author})</author>
      ${(post.tags || []).map((t) => `<category>${escape(t)}</category>`).join('')}
    </item>`
}

function rssFeed(config, posts, page = 'feed.xml') {
  return `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(config.title)}</title>
    <link>${config.siteUrl}/blog</link>
    <description>${escape(config.description)}</description>
    <language>${config.language}</language>
    <managingEditor>${config.email} (${config.author})</managingEditor>
    <webMaster>${config.email} (${config.author})</webMaster>
    <lastBuildDate>${posts[0] ? new Date(posts[0].date).toUTCString() : ''}</lastBuildDate>
    <atom:link href="${config.siteUrl}/${page}" rel="self" type="application/rss+xml"/>
    ${posts.map((p) => rssItem(config, p)).join('')}
  </channel>
</rss>`
}

export function generateRSS(config, allBlogs, page = 'feed.xml') {
  const publicFolder = 'public'
  const sorted = [...allBlogs].sort((a, b) => +new Date(b.date) - +new Date(a.date))
  if (sorted.length === 0) return

  // main feed
  writeFileSync(path.join(publicFolder, page), rssFeed(config, sorted))

  // per-tag feeds, so /tags/<tag>/feed.xml keeps working
  const tags = {}
  sorted.forEach((p) => (p.tags || []).forEach((t) => (tags[slug(t)] = true)))
  Object.keys(tags).forEach((tag) => {
    const filtered = sorted.filter((p) => (p.tags || []).map((t) => slug(t)).includes(tag))
    const dir = path.join(publicFolder, 'tags', tag)
    mkdirSync(dir, { recursive: true })
    writeFileSync(path.join(dir, page), rssFeed(config, filtered, `tags/${tag}/${page}`))
  })
}
