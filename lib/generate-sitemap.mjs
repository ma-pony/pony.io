import { writeFileSync } from 'fs'
import { slug } from 'github-slugger'

// Self-contained replacement for pliny <0.2's removed `pliny/utils/generate-sitemap`.
export function generateSitemap(siteUrl, allBlogs) {
  const posts = [...allBlogs].sort((a, b) => +new Date(b.date) - +new Date(a.date))

  const staticRoutes = ['', 'blog', 'tags', 'projects', 'about']
  const postRoutes = posts.map((p) => `blog/${p.slug}`)
  const tags = new Set()
  posts.forEach((p) => (p.tags || []).forEach((t) => tags.add(slug(t))))
  const tagRoutes = [...tags].map((t) => `tags/${t}`)

  const urls = [...staticRoutes, ...postRoutes, ...tagRoutes]
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((route) => `  <url><loc>${siteUrl}/${route}</loc></url>`)
  .join('\n')}
</urlset>`

  writeFileSync('public/sitemap.xml', sitemap)
}
