import * as fs from 'fs'
import * as path from 'path'
import type { Article } from './types'

/**
 * 从文件名中提取日期（格式：YYYY-MM-DD.md）
 */
function extractDateFromFilename(filePath: string): string | null {
  const basename = path.basename(filePath, path.extname(filePath))
  const match = basename.match(/^(\d{4}-\d{2}-\d{2})/)
  return match ? match[1] : null
}

/**
 * 从内容中提取日期
 */
function extractDateFromContent(content: string): string | null {
  // 尝试匹配标题中的日期，如 "机会雷达日报 2026-02-10"
  const match = content.match(/(\d{4}-\d{2}-\d{2})/)
  return match ? match[1] : null
}

/**
 * 从内容中提取标题
 * 取第一个 # 标题
 */
function extractTitle(content: string): string {
  const match = content.match(/^#\s+(.+)$/m)
  if (match) {
    return match[1].trim()
  }
  return 'Untitled'
}

/**
 * 从"今日研判总结"部分提取摘要
 */
function extractSummary(content: string): string {
  // 查找"今日研判总结"部分
  const summarySection = content.match(
    /##\s*📊?\s*今日研判总结\s*\n([\s\S]*?)(?=\n---|\n\*报告生成|$)/
  )

  if (summarySection) {
    // 提取该部分的第一段有意义的文本
    const lines = summarySection[1]
      .split('\n')
      .filter((line) => {
        const trimmed = line.trim()
        return trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('---')
      })
      .slice(0, 5) // 取前 5 行

    const summary = lines
      .map((l) => l.replace(/^[*-]\s*/, '').replace(/\*\*/g, ''))
      .join(' ')
      .trim()

    if (summary.length > 200) {
      return summary.slice(0, 197) + '...'
    }
    return summary
  }

  // fallback: 取第一段非标题文本
  const firstParagraph = content
    .split('\n')
    .filter((line) => {
      const trimmed = line.trim()
      return trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('---')
    })
    .slice(0, 3)
    .join(' ')
    .trim()

  if (firstParagraph.length > 200) {
    return firstParagraph.slice(0, 197) + '...'
  }
  return firstParagraph
}

/**
 * 自动提取 tags
 */
function extractTags(content: string): string[] {
  const tags: Set<string> = new Set()

  // 基础 tags
  tags.add('日报')
  tags.add('机会雷达')

  // 检测内容中的关键主题
  const topicMap: Record<string, string[]> = {
    crypto: ['BTC', 'ETH', '加密货币', 'Bitcoin', 'Ethereum', 'DeFi'],
    AI: ['AI', '人工智能', 'GPT', 'LLM', 'Agent'],
    DeFi: ['DeFi', 'TVL', 'DEX', 'Uniswap', 'Hyperliquid'],
  }

  for (const [tag, keywords] of Object.entries(topicMap)) {
    if (keywords.some((kw) => content.includes(kw))) {
      tags.add(tag)
    }
  }

  return Array.from(tags)
}

/**
 * 去掉报告末尾的元信息（生成时间、数据来源、免责声明）
 */
function trimFooter(content: string): string {
  // 去掉末尾的斜体元信息行
  const lines = content.split('\n')
  let endIndex = lines.length

  // 从末尾往前找，去掉空行和 *...* 格式的元信息
  for (let i = lines.length - 1; i >= 0; i--) {
    const trimmed = lines[i].trim()
    if (trimmed === '' || trimmed.startsWith('*') && trimmed.endsWith('*')) {
      endIndex = i
    } else {
      break
    }
  }

  return lines.slice(0, endIndex).join('\n').trimEnd()
}

/**
 * 将机会雷达报告 MD 文件转换为 Article 格式
 */
export function convertRadarReport(markdownPath: string): Article {
  const resolvedPath = path.resolve(markdownPath)

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Report file not found: ${resolvedPath}`)
  }

  const rawContent = fs.readFileSync(resolvedPath, 'utf-8')

  // 提取日期
  const date =
    extractDateFromFilename(resolvedPath) || extractDateFromContent(rawContent) || new Date().toISOString().slice(0, 10)

  // 提取标题
  const rawTitle = extractTitle(rawContent)
  const title = rawTitle

  // 提取摘要
  const summary = extractSummary(rawContent)

  // 提取 tags
  const tags = extractTags(rawContent)

  // 处理内容：去掉第一行标题（会放到 frontmatter 中），去掉末尾元信息
  let content = rawContent
  // 去掉第一个 # 标题行
  content = content.replace(/^#\s+.+\n*/, '')
  // 去掉末尾元信息
  content = trimFooter(content)
  // 清理开头多余空行
  content = content.replace(/^\n+/, '')

  return {
    title,
    date,
    summary,
    content,
    tags,
    category: 'daily-radar',
    authors: ['default'],
  }
}
