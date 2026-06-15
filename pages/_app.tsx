import '@/css/tailwind.css'
import '@/css/prism.css'
import 'katex/dist/katex.css'
// import '@/css/docsearch.css' // Uncomment if using algolia docsearch
// import '@docsearch/css' // Uncomment if using algolia docsearch

import { ThemeProvider } from 'next-themes'
import type { AppProps } from 'next/app'
import Head from 'next/head'

import siteMetadata from '@/data/siteMetadata'
import { Analytics } from '@vercel/analytics/react'
import LayoutWrapper from '@/components/LayoutWrapper'
// Search is disabled (siteMetadata.search is commented out). pliny/search pulls
// @docsearch/react (CJS) which breaks ESM page-data collection, so SearchProvider
// is omitted. To re-enable: set siteMetadata.search and re-add SearchProvider.

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme={siteMetadata.theme}>
      <Head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8425376455595468"
          crossOrigin="anonymous"
        ></script>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <Analytics />
      <LayoutWrapper>
        <Component {...pageProps} />
      </LayoutWrapper>
    </ThemeProvider>
  )
}
