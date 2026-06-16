import { generateLlmsTxt } from '../lib/generate-llms.mjs'
import siteMetadata from '../data/siteMetadata.js'
import { allBlogs } from '../.contentlayer/generated/index.mjs'

const llms = () => {
  generateLlmsTxt(siteMetadata, allBlogs)
  console.log('llms.txt generated...')
}
export default llms
