import { execSync } from 'child_process'
import * as path from 'path'
import { BlogAdapter } from './adapters/blog'
import { FeishuAdapter } from './adapters/feishu'
import { TwitterAdapter } from './adapters/twitter'
import { WechatAdapter } from './adapters/wechat'
import { convertRadarReport } from './converter'
import type { PlatformAdapter, PublishResult } from './types'

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
    console.error(
      'Usage: npx tsx scripts/publish/publish.ts --source <path> [--platforms blog,feishu] [--dry-run]'
    )
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

  // 4. 自动 git commit + push（仅在非 dry-run 且有成功发布时）
  if (!dryRun && results.some((r) => r.success)) {
    console.log('')
    console.log('🚀 Auto git commit & push...')
    try {
      const projectRoot = path.resolve(__dirname, '..', '..')
      const dateStr = new Date().toISOString().slice(0, 10)
      execSync('git add -A', { cwd: projectRoot, stdio: 'pipe' })
      // 检查是否有变更需要提交
      try {
        execSync('git diff --cached --quiet', { cwd: projectRoot, stdio: 'pipe' })
        console.log('   ℹ️  No changes to commit')
      } catch {
        // diff --cached --quiet 返回非零 = 有变更
        execSync(`git commit -m "publish: ${dateStr} ${platforms.join(', ')}"`, {
          cwd: projectRoot,
          stdio: 'pipe',
        })
        execSync('git push', {
          cwd: projectRoot,
          stdio: 'pipe',
        })
        console.log('   ✅ Git push complete — Vercel deployment triggered')
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? (err as unknown as { stderr?: Buffer }).stderr?.toString() || err.message
          : String(err)
      console.error(`   ⚠️  Git push failed: ${message}`)
      console.error('   Please manually run: git add -A && git commit && git push')
    }
  }

  process.exit(allSuccess ? 0 : 1)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
