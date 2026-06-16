import Document, { Html, Head, Main, NextScript } from 'next/document'
import siteMetadata from '@/data/siteMetadata'

// Site-wide structured data, server-rendered so AI crawlers (GPTBot / ClaudeBot /
// PerplexityBot) — which read only the initial HTML — get a clean entity graph:
// the WebSite and the Person behind it, with sameAs links tying the blog to real
// off-site profiles. This is the E-E-A-T / entity signal answer engines lean on.
const siteLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteMetadata.siteUrl}/#website`,
      url: siteMetadata.siteUrl,
      name: siteMetadata.title,
      description: siteMetadata.seoDescription || siteMetadata.description,
      inLanguage: 'zh-CN',
      publisher: { '@id': `${siteMetadata.siteUrl}/#person` },
    },
    {
      '@type': 'Person',
      '@id': `${siteMetadata.siteUrl}/#person`,
      name: siteMetadata.author,
      url: siteMetadata.siteUrl,
      image: `${siteMetadata.siteUrl}${siteMetadata.image}`,
      jobTitle: 'Backend Developer',
      sameAs: [
        siteMetadata.github,
        siteMetadata.bilibili && siteMetadata.bilibili.replace(/\/dynamic\/?$/, ''),
      ].filter(Boolean),
    },
  ],
}

class MyDocument extends Document {
  render() {
    return (
      <Html lang={siteMetadata.language} className="scroll-smooth">
        <Head>
          <link rel="apple-touch-icon" sizes="76x76" href="/static/favicons/apple-touch-icon.png" />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/static/favicons/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/static/favicons/favicon-16x16.png"
          />
          <link rel="manifest" href="/static/favicons/site.webmanifest" />
          <link rel="mask-icon" href="/static/favicons/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="msapplication-TileColor" content="#000000" />
          <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
          <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
          <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(siteLd) }}
          />
        </Head>
        <body className="bg-white text-black antialiased dark:bg-gray-900 dark:text-white">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
