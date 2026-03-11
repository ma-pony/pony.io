import fs from 'fs/promises'
import matter from 'gray-matter'
import globbyPkg from 'globby'

const globby = globbyPkg.globby ?? globbyPkg.default ?? globbyPkg

const BLOG_FILES_GLOB = 'data/blog/**/*.{md,mdx}'
const REQUIRED_FIELDS = ['title', 'date']

function stripInlineCode(line) {
  return line.replace(/`[^`]*`/g, '')
}

function checkRiskyAngleBrackets(content) {
  const issues = []
  const lines = content.split('\n')
  let inFence = false

  lines.forEach((line, index) => {
    if (/^\s*```/.test(line)) {
      inFence = !inFence
      return
    }

    if (inFence) {
      return
    }

    const normalized = stripInlineCode(line)
    const match = normalized.match(/(^|[^\\])<\s*\d/)
    if (match) {
      issues.push({
        line: index + 1,
        message: '检测到可能触发 MDX JSX 解析的 `<数字` 写法，请改成“低于/不足”等文本表述。',
      })
    }
  })

  return issues
}

async function main() {
  const files = await globby(BLOG_FILES_GLOB)
  const issues = []

  for (const file of files) {
    const raw = await fs.readFile(file, 'utf8')

    try {
      const parsed = matter(raw)

      for (const field of REQUIRED_FIELDS) {
        if (!parsed.data[field]) {
          issues.push({
            file,
            line: 1,
            message: `缺少必填 frontmatter 字段 \`${field}\`。`,
          })
        }
      }
    } catch (error) {
      issues.push({
        file,
        line: 1,
        message: `frontmatter/YAML 解析失败：${error.message}`,
      })
      continue
    }

    for (const issue of checkRiskyAngleBrackets(raw)) {
      issues.push({
        file,
        line: issue.line,
        message: issue.message,
      })
    }
  }

  if (issues.length > 0) {
    console.error(`发现 ${issues.length} 个内容问题：`)
    for (const issue of issues) {
      console.error(`- ${issue.file}:${issue.line} ${issue.message}`)
    }
    process.exit(1)
  }

  console.log(`内容检查通过，共扫描 ${files.length} 个文件。`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
