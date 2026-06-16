import rss from './rss.mjs'
import sitemap from './sitemap.mjs'
import search from './search.mjs'
import llms from './llms.mjs'

async function postbuild() {
  await Promise.all([rss(), sitemap(), search(), llms()])
}

postbuild()
