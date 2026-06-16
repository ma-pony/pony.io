import { writeFileSync } from 'fs'
import { slug } from 'github-slugger'

// Self-contained replacement for pliny <0.2's removed `pliny/utils/generate-sitemap`.
export function generateSitemap(siteUrl, allBlogs) {
  const posts = [...allBlogs].sort((a, b) => +new Date(b.date) - +new Date(a.date))
  const day = (d) => new Date(d).toISOString().split('T')[0]
  const today = day(Date.now())
  // Newest post date = best freshness signal for the list/index pages.
  const newestPostDate = posts.length ? day(posts[0].lastmod || posts[0].date) : today

  // `lastmod` is the one sitemap signal Google actually trusts, and freshness is a
  // strong ranking factor for AI answer engines (Perplexity especially). Carry each
  // post's real modified date; let index pages track the newest post.
  const entries = []
  const staticRoutes = ['', 'blog', 'tags', 'projects', 'about']
  staticRoutes.forEach((route) => entries.push({ route, lastmod: newestPostDate }))
  posts.forEach((p) =>
    entries.push({ route: `blog/${p.slug}`, lastmod: day(p.lastmod || p.date) })
  )
  const tags = new Map()
  posts.forEach((p) =>
    (p.tags || []).forEach((t) => {
      const k = slug(t)
      const d = day(p.lastmod || p.date)
      // keep the most recent post date for each tag page
      if (!tags.has(k) || d > tags.get(k)) tags.set(k, d)
    })
  )
  tags.forEach((lastmod, k) => entries.push({ route: `tags/${k}`, lastmod }))

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    ({ route, lastmod }) =>
      `  <url><loc>${siteUrl}/${route}</loc><lastmod>${lastmod}</lastmod></url>`
  )
  .join('\n')}
</urlset>`

  writeFileSync('public/sitemap.xml', sitemap)
}
