import type { Article, PlatformAdapter, PublishResult } from '../types'

export class WechatAdapter implements PlatformAdapter {
  name = 'wechat'

  /**
   * Markdown 转微信公众号 HTML 格式
   * TODO: 完善 Markdown 到微信 HTML 的转换
   */
  formatContent(article: Article): string {
    // TODO: 实现完整的 Markdown -> 微信公众号 HTML 转换
    // 微信公众号对 HTML 有严格限制：
    // - 不支持外部 CSS，只能用 inline style
    // - 不支持 <script>
    // - 图片需要先上传到微信素材库
    // - 表格需要用 inline style 美化

    const html = `
<h1>${article.title}</h1>
<p><em>${article.date}</em></p>
<section>
${article.content}
</section>
<p><small>Tags: ${article.tags.join(', ')}</small></p>
    `.trim()

    return html
  }

  /**
   * 通过微信公众号 API 发布文章
   * TODO: 实现微信公众号 API 调用
   * 需要配置：WECHAT_APP_ID, WECHAT_APP_SECRET
   */
  async publish(article: Article): Promise<PublishResult> {
    // TODO: 实现微信公众号发布
    // 1. 获取 access_token
    // 2. 上传图片素材 POST /cgi-bin/material/add_material
    // 3. 新建草稿 POST /cgi-bin/draft/add
    // 4. 发布 POST /cgi-bin/freepublish/submit
    console.log(`⏳ Wechat adapter not implemented yet. Article: ${article.title}`)
    return {
      platform: this.name,
      success: false,
      error: 'Wechat adapter not implemented yet',
    }
  }
}
