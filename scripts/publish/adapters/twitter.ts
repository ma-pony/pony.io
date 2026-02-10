import type { Article, PlatformAdapter, PublishResult } from '../types'

export class TwitterAdapter implements PlatformAdapter {
  name = 'twitter'

  /**
   * 提取摘要，限制 280 字符，加链接
   */
  formatContent(article: Article): string {
    const blogUrl = article.canonicalUrl || `https://pony.io/blog/${article.category}/${article.date}`
    const maxLen = 280 - blogUrl.length - 2 // 留出链接和换行的空间

    let text = article.summary
    if (text.length > maxLen) {
      text = text.slice(0, maxLen - 3) + '...'
    }

    // 添加 hashtags
    const tags = article.tags
      .slice(0, 3)
      .map((t) => `#${t.replace(/\s+/g, '')}`)
      .join(' ')

    const tweet = `${text}\n\n${tags}\n${blogUrl}`

    // 最终截断保证不超过 280
    if (tweet.length > 280) {
      return tweet.slice(0, 277) + '...'
    }

    return tweet
  }

  /**
   * 通过 Twitter API 发送推文
   * TODO: 实现 Twitter API v2 调用
   * 需要配置：TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_SECRET
   */
  async publish(article: Article): Promise<PublishResult> {
    // TODO: 实现 Twitter 发布
    // 1. OAuth 1.0a 认证
    // 2. POST /2/tweets
    console.log(`⏳ Twitter adapter not implemented yet. Article: ${article.title}`)
    return {
      platform: this.name,
      success: false,
      error: 'Twitter adapter not implemented yet',
    }
  }
}
