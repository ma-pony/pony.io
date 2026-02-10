import { BlogAdapter } from './adapters/blog'
import { FeishuAdapter } from './adapters/feishu'
import { TwitterAdapter } from './adapters/twitter'
import { WechatAdapter } from './adapters/wechat'
import { convertRadarReport } from './converter'
import type { PlatformAdapter, PublishConfig, PublishResult } from './types'

// 平台适配器注册表
const adapterRegistry: Record<string, () => PlatformAdapter> = {
  blog: () => new BlogAdapter(),
  feishu: () => new FeishuAdapter(),
  twitter: () => new TwitterAdapter(),
  wechat: () => new WechatAdapter(),
}

function parseArgs(args: string[]): { source: string; platforms: string[]; dryRun: boolean } {
  let source = ''
  let platforms: string[] = ['blog']
  let dryRun = false

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--source':
        source = args[++i]
        break
      case '--platforms':
        platforms = args[++i].split(',').map((p) => p.trim())
        break
      case '--dry-run':
        dryRun = true
        break
    }
  }

  if (!source) {
    console.error('Usage: npx tsx scripts/publish/publish.ts --source <path> [--platforms blog,feishu] [--dry-run]')
    process.exit(1)
  }

  return { source, platforms, dryRun }
}

async function main() {
  const { source, platforms, dryRun } = parseArgs(process.argv.slice(2))

  console.log('📰 Report Publisher')
  console.log(`   Source: ${source}`)
  console.log(`   Platforms: ${platforms.join(', ')}`)
  console.log(`   Dry run: ${dryRun}`)
  console.log('')

  // 1. 转换报告为 Article
  console.log('🔄 Converting report...')
  const article = convertRadarReport(source)
  console.log(`   Title: ${article.title}`)
  console.log(`   Date: ${article.date}`)
  console.log(`   Tags: ${article.tags.join(', ')}`)
  console.log(`   Summary: ${article.summary.slice(0, 80)}...`)
  console.log('')

  // 2. 发布到各平台
  const results: PublishResult[] = []

  for (const platformName of platforms) {
    const createAdapter = adapterRegistry[platformName]
    if (!createAdapter) {
      console.error(`❌ Unknown platform: ${platformName}`)
      console.error(`   Available platforms: ${Object.keys(adapterRegistry).join(', ')}`)
      results.push({
        platform: platformName,
        success: false,
        error: `Unknown platform: ${platformName}`,
      })
      continue
    }

    const adapter = createAdapter()

    if (dryRun) {
      console.log(`🔍 [DRY RUN] ${adapter.name}:`)
      const formatted = adapter.formatContent(article)
      console.log(formatted.slice(0, 500))
      if (formatted.length > 500) {
        console.log(`   ... (${formatted.length} chars total)`)
      }
      results.push({
        platform: adapter.name,
        success: true,
        metadata: { dryRun: true, contentLength: formatted.length },
      })
    } else {
      console.log(`📤 Publishing to ${adapter.name}...`)
      const result = await adapter.publish(article)
      results.push(result)
    }

    console.log('')
  }

  // 3. 输出结果汇总
  console.log('📊 Results:')
  for (const result of results) {
    const icon = result.success ? '✅' : '❌'
    const detail = result.url || result.error || (result.metadata?.dryRun ? 'dry run' : '')
    console.log(`   ${icon} ${result.platform}: ${detail}`)
  }

  const allSuccess = results.every((r) => r.success)
  process.exit(allSuccess ? 0 : 1)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
