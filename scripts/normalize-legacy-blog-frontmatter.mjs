import fs from 'fs/promises'
import path from 'path'
import globbyPkg from 'globby'

const globby = globbyPkg.globby ?? globbyPkg.default ?? globbyPkg
const ROOT = process.cwd()
const BLOG_FILES_GLOB = 'data/blog/**/*.md'

function yamlString(value) {
  return `'${String(value).replace(/'/g, "''")}'`
}

function stripExistingFrontmatter(content) {
  if (!content.startsWith('---\n')) {
    return content.replace(/^\n+/, '')
  }

  const endMarkerIndex = content.indexOf('\n---\n', 4)
  if (endMarkerIndex === -1) {
    return content.replace(/^\n+/, '')
  }

  return content.slice(endMarkerIndex + 5).replace(/^\n+/, '')
}

function cleanText(value) {
  return value
    .replace(/^#+\s*/, '')
    .replace(/^[`>*-\s]+/, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function pickTitle(body, fallback) {
  const lines = body.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue
    const heading = trimmed.match(/^#{1,6}\s+(.+)$/)
    if (heading) {
      return cleanText(heading[1])
    }

    const candidate = cleanText(trimmed)
    if (candidate) {
      return candidate
    }
  }

  return fallback
}

function pickSummary(body, title) {
  const lines = body.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || /^#{1,6}\s+/.test(trimmed) || /^```/.test(trimmed)) continue
    const candidate = cleanText(trimmed)
    if (candidate && candidate !== title) {
      return candidate.slice(0, 140)
    }
  }

  return title
}

function inferTags(relativePath) {
  const parts = relativePath.split(path.sep)
  const dirParts = parts.slice(0, -1)
  const tags = []

  for (const part of dirParts) {
    const normalized = part.replace(/^learn-/, '')
    for (const segment of normalized.split('-')) {
      if (segment && !tags.includes(segment)) {
        tags.push(segment)
      }
    }
  }

  return tags.length > 0 ? tags : ['notes']
}

function inferFallbackTitle(relativePath) {
  const basename = path.basename(relativePath, '.md')
  if (basename.toLowerCase() === 'readme') {
    return path.basename(path.dirname(relativePath))
  }

  return basename.replace(/[-_]+/g, ' ')
}

async function main() {
  const files = await globby(BLOG_FILES_GLOB)

  for (const file of files) {
    const absolutePath = path.join(ROOT, file)
    const original = await fs.readFile(absolutePath, 'utf8')
    const body = stripExistingFrontmatter(original)
    const relativeBlogPath = file.replace(/^data\/blog\//, '')
    const fallbackTitle = inferFallbackTitle(relativeBlogPath)
    const title = pickTitle(body, fallbackTitle)
    const summary = pickSummary(body, title)
    const tags = inferTags(relativeBlogPath)
    const stat = await fs.stat(absolutePath)
    const date = stat.mtime.toISOString().slice(0, 10)

    const frontmatter = [
      '---',
      `title: ${yamlString(title)}`,
      `date: ${yamlString(date)}`,
      `tags: [${tags.map((tag) => yamlString(tag)).join(', ')}]`,
      'draft: false',
      `summary: ${yamlString(summary)}`,
      '---',
      '',
    ].join('\n')

    await fs.writeFile(absolutePath, `${frontmatter}${body}`, 'utf8')
  }

  console.log(`Normalized ${files.length} legacy blog files.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
