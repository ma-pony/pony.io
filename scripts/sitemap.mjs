import { generateSitemap } from '../lib/generate-sitemap.mjs'
import siteMetadata from '../data/siteMetadata.js'
import { allBlogs } from '../.contentlayer/generated/index.mjs'

const sitemap = () => {
  generateSitemap(
    siteMetadata.siteUrl,
    allBlogs.filter((post) => !post.draft && !post.noindex)
  )
  console.log('Sitemap generated...')
}
export default sitemap
