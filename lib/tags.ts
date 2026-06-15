import { slug } from 'github-slugger'

// pliny <0.2 exported getAllTags from 'pliny/utils/contentlayer'; it was removed
// in 0.2 (upstream switched to a generated tag-data.json). Kept local to preserve
// behavior: count tags by slug across the given posts. Callers pre-filter drafts.
export async function getAllTags(posts: { tags?: string[] }[]) {
  const tagCount: Record<string, number> = {}
  for (const post of posts) {
    if (!post.tags) continue
    for (const tag of post.tags) {
      const t = slug(tag)
      tagCount[t] = (tagCount[t] || 0) + 1
    }
  }
  return tagCount
}
