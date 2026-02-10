import type { Article, PlatformAdapter, PublishResult } from '../types'

export class FeishuAdapter implements PlatformAdapter {
  name = 'feishu'

  /**
   * 将 Markdown 转为飞书富文本格式
   * TODO: 实现飞书富文本转换
   * 飞书文档 API: https://open.feishu.cn/document/server-docs/docs/docs/overview
   */
  formatContent(article: Article): string {
    // TODO: 将 Markdown 转为飞书 Block 格式
    // 飞书富文本使用 JSON 结构，包含 paragraph、heading、code_block 等类型
    return JSON.stringify({
      title: article.title,
      content: article.content,
      _note: 'TODO: 转换为飞书富文本 Block 格式',
    })
  }

  /**
   * 通过飞书 API 发送文档
   * TODO: 实现飞书 API 调用
   * 需要配置：FEISHU_APP_ID, FEISHU_APP_SECRET, FEISHU_FOLDER_TOKEN
   */
  async publish(article: Article): Promise<PublishResult> {
    // TODO: 实现飞书发布
    // 1. 获取 tenant_access_token
    // 2. 创建文档 POST /open-apis/docx/v1/documents
    // 3. 写入内容 POST /open-apis/docx/v1/documents/:document_id/blocks/batch_update
    console.log(`⏳ Feishu adapter not implemented yet. Article: ${article.title}`)
    return {
      platform: this.name,
      success: false,
      error: 'Feishu adapter not implemented yet',
    }
  }
}
