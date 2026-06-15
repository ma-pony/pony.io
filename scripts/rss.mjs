import { generateRSS } from '../lib/generate-rss.mjs'
import siteMetadata from '../data/siteMetadata.js'
import { allBlogs } from '../.contentlayer/generated/index.mjs'

const rss = () => {
  generateRSS(
    siteMetadata,
    allBlogs.filter((post) => !post.draft && !post.noindex)
  )
  console.log('RSS feed generated...')
}
export default rss
