#!/bin/bash
# 博客封面图生成器
# 用法: ./gen-cover.sh "标题文字" output.png [副标题]
# 生成 1200x630 OG image（深色背景 + 白色中文标题）

TITLE="$1"
OUTPUT="$2"
SUBTITLE="${3:-ponyma.io}"

if [ -z "$TITLE" ] || [ -z "$OUTPUT" ]; then
  echo "用法: $0 \"标题\" output.png [副标题]"
  exit 1
fi

DIR=$(dirname "$OUTPUT")
mkdir -p "$DIR"

TMPDIR=$(mktemp -d)

# 1. 背景（深蓝灰 + 左侧装饰条 + 底部条）
convert -size 1200x630 xc:'#1a1b2e' \
  -fill '#4f46e5' -draw "rectangle 0,0 8,630" \
  -fill '#2d2e45' -draw "rectangle 0,580 1200,630" \
  "$TMPDIR/bg.png"

# 2. 标题文字层（自动换行）
convert -size 1080x280 -background none -fill white \
  -font "PingFang-SC-Semibold" -pointsize 52 \
  -gravity West caption:"$TITLE" \
  "$TMPDIR/title.png"

# 3. 合成标题到背景
composite -gravity NorthWest -geometry +60+160 \
  "$TMPDIR/title.png" "$TMPDIR/bg.png" "$TMPDIR/comp.png"

# 4. 加副标题
convert "$TMPDIR/comp.png" \
  -font "PingFang-SC-Regular" -fill '#8b8fa3' -pointsize 22 \
  -gravity SouthWest -annotate +60+18 "$SUBTITLE" \
  "$OUTPUT"

# 清理
rm -rf "$TMPDIR"

echo "✅ 封面图已生成: $OUTPUT ($(identify -format '%wx%h' "$OUTPUT"))"
