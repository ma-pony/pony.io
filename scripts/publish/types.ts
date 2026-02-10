// 统一的文章中间格式，所有报告先转成这个格式，再由各平台 adapter 转换
export interface Article {
  title: string
  date: string // YYYY-MM-DD
  summary: string
  content: string // Markdown 内容（不含 frontmatter）
  tags: string[]
  category: string // 对应 blog 子目录名
  authors?: string[]
  images?: string[]
  canonicalUrl?: string
  metadata?: Record<string, unknown> // 扩展字段
}

// 平台适配器接口
export interface PlatformAdapter {
  name: string
  publish(article: Article): Promise<PublishResult>
  formatContent(article: Article): string // 将统一格式转为平台特定格式
}

export interface PublishResult {
  platform: string
  success: boolean
  url?: string
  error?: string
  metadata?: Record<string, unknown>
}

// 发布配置
export interface PublishConfig {
  platforms: string[] // 要发布到哪些平台
  dryRun?: boolean // 只生成不发布
}
