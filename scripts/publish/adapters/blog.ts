import * as fs from 'fs'
import * as path from 'path'
import type { Article, PlatformAdapter, PublishResult } from '../types'

// 项目根目录
const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..')

/**
 * 将 title 转成 URL-friendly 的 slug
 * 中文标题直接用拼音或简化处理，这里用简单的方式：去掉 emoji 和特殊字符
 */
function generateSlug(title: string): string {
  return title
    .replace(/[\u{1F600}-\u{1F9FF}]/gu, '') // 去掉 emoji
    .replace(/[^\w\u4e00-\u9fff\s-]/g, '') // 保留中英文、数字、空格、连字符
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase()
}

/**
 * 转义 MDX 中不兼容的语法
 * - { } 在 MDX 中会被当作 JSX 表达式，需要转义
 * - < > 在非 JSX 上下文中可能需要处理
 */
function escapeMdxContent(content: string): string {
  const lines = content.split('\n')
  let inCodeBlock = false
  let inTable = false

  const escaped = lines.map((line) => {
    // 检测代码块边界
    if (line.trimStart().startsWith('```')) {
      inCodeBlock = !inCodeBlock
      return line
    }

    // 代码块内不转义
    if (inCodeBlock) {
      return line
    }

    // 检测表格行（以 | 开头）
    if (line.trimStart().startsWith('|')) {
      inTable = true
    } else if (inTable && !line.trimStart().startsWith('|')) {
      inTable = false
    }

    // 转义花括号：将 { 替换为 {'{'} ，将 } 替换为 {'}'}
    // 但要避免转义已经是 JSX 表达式的内容
    let escaped = line

    // 转义独立的花括号（不在行内代码中）
    escaped = escapeLinebraces(escaped)

    return escaped
  })

  return escaped.join('\n')
}

/**
 * 转义一行中的花括号，跳过行内代码
 */
function escapeLinebraces(line: string): string {
  const segments: string[] = []
  let inInlineCode = false
  let current = ''

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '`') {
      inInlineCode = !inInlineCode
      current += char
      continue
    }

    if (inInlineCode) {
      current += char
      continue
    }

    if (char === '{') {
      current += "{'{'}"
    } else if (char === '}') {
      current += "{'}'}"
    } else {
      current += char
    }
  }

  return current
}

/**
 * 生成 MDX frontmatter
 */
function generateFrontmatter(article: Article): string {
  const lines = ['---']
  lines.push(`title: '${article.title.replace(/'/g, "''")}'`)
  lines.push(`date: '${article.date}'`)
  lines.push(`tags: [${article.tags.map((t) => `'${t}'`).join(', ')}]`)
  lines.push('draft: false')
  lines.push(`summary: '${article.summary.replace(/'/g, "''")}'`)

  if (article.authors && article.authors.length > 0) {
    lines.push(`authors: [${article.authors.map((a) => `'${a}'`).join(', ')}]`)
  }

  if (article.images && article.images.length > 0) {
    lines.push(`images: [${article.images.map((img) => `'${img}'`).join(', ')}]`)
  }

  if (article.canonicalUrl) {
    lines.push(`canonicalUrl: '${article.canonicalUrl}'`)
  }

  lines.push('---')
  return lines.join('\n')
}

export class BlogAdapter implements PlatformAdapter {
  name = 'blog'

  formatContent(article: Article): string {
    const frontmatter = generateFrontmatter(article)
    const escapedContent = escapeMdxContent(article.content)
    return `${frontmatter}\n\n${escapedContent}\n`
  }

  async publish(article: Article): Promise<PublishResult> {
    try {
      const slug = generateSlug(article.title)
      const filename = `${article.date}-${slug}.mdx`
      const categoryDir = path.join(PROJECT_ROOT, 'data', 'blog', article.category)
      const filePath = path.join(categoryDir, filename)

      // 确保目录存在
      if (!fs.existsSync(categoryDir)) {
        fs.mkdirSync(categoryDir, { recursive: true })
      }

      // 生成 MDX 内容
      const mdxContent = this.formatContent(article)

      // 写入文件
      fs.writeFileSync(filePath, mdxContent, 'utf-8')

      const relativePath = path.relative(PROJECT_ROOT, filePath)
      console.log(`✅ Blog article published: ${relativePath}`)

      return {
        platform: this.name,
        success: true,
        url: relativePath,
        metadata: { filePath, filename },
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error(`❌ Blog publish failed: ${message}`)
      return {
        platform: this.name,
        success: false,
        error: message,
      }
    }
  }
}
