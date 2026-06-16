import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Markdown for Agents — content negotiation at the SAME url. (Next 16 calls this
// the "proxy" convention; it's the former middleware.)
// Browsers send `Accept: text/html,...` (never text/markdown) and pass straight
// through to the normal HTML page. An agent that sends `Accept: text/markdown`
// gets an internal rewrite (the visible URL stays /blog/...) to the /api/md
// handler, which returns the post's source Markdown with the right Content-Type.
// We run only on content routes (see `matcher`) so static assets/_next are untouched.
export const config = {
  matcher: ['/', '/blog/:path*'],
}

export function proxy(req: NextRequest) {
  const accept = req.headers.get('accept') || ''
  const wantsMarkdown = /text\/(x-)?markdown/i.test(accept)
  if (!wantsMarkdown) return NextResponse.next()

  // Carry the original path in a request header — headers survive a rewrite
  // reliably, whereas added query params can be dropped.
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-md-path', req.nextUrl.pathname)
  return NextResponse.rewrite(new URL('/api/md', req.url), {
    request: { headers: requestHeaders },
  })
}
