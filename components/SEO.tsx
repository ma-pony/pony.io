import Head from 'next/head'
import { useRouter } from 'next/router'
import siteMetadata from '@/data/siteMetadata'
import { CoreContent } from 'pliny/utils/contentlayer.js'
import type { Blog, Authors, Workspace } from 'contentlayer/generated'
interface CommonSEOProps {
  title: string
  description: string
  ogType: string
  ogImage:
    | string
    | {
        '@type': string
        url: string
      }[]
  twImage: string
  canonicalUrl?: string
  noindex?: boolean
}

const CommonSEO = ({
  title,
  description,
  ogType,
  ogImage,
  twImage,
  canonicalUrl,
  noindex,
}: CommonSEOProps) => {
  const router = useRouter()
  return (
    <Head>
      <title>{title}</title>
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'follow, index'} />
      <meta name="description" content={description} />
      <meta property="og:url" content={`${siteMetadata.siteUrl}${router.asPath}`} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={siteMetadata.title} />
      <meta property="og:description" content={description} />
      <meta property="og:title" content={title} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={twImage} />
      {Array.isArray(ogImage) ? (
        ogImage.map(({ url }) => <meta property="og:image" content={url} key={url} />)
      ) : (
        <meta property="og:image" content={ogImage} key={ogImage} />
      )}
      <link
        rel="canonical"
        href={canonicalUrl ? canonicalUrl : `${siteMetadata.siteUrl}${router.asPath}`}
      />
    </Head>
  )
}

interface PageSEOProps {
  title: string
  description: string
}

export const PageSEO = ({ title, description }: PageSEOProps) => {
  const ogImageUrl = siteMetadata.siteUrl + siteMetadata.socialBanner
  const twImageUrl = siteMetadata.siteUrl + siteMetadata.socialBanner
  return (
    <CommonSEO
      title={title}
      description={description}
      ogType="website"
      ogImage={ogImageUrl}
      twImage={twImageUrl}
    />
  )
}

export const TagSEO = ({ title, description }: PageSEOProps) => {
  const ogImageUrl = siteMetadata.siteUrl + siteMetadata.socialBanner
  const twImageUrl = siteMetadata.siteUrl + siteMetadata.socialBanner
  const router = useRouter()
  return (
    <>
      <CommonSEO
        title={title}
        description={description}
        ogType="website"
        ogImage={ogImageUrl}
        twImage={twImageUrl}
      />
      <Head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${description} - RSS feed`}
          href={`${siteMetadata.siteUrl}${router.asPath}/feed.xml`}
        />
      </Head>
    </>
  )
}

interface BlogSeoProps extends CoreContent<Blog | Workspace> {
  authorDetails?: CoreContent<Authors>[]
  url: string
  images?: string[]
  canonicalUrl?: string
  noindex?: boolean
}

export const BlogSEO = ({
  authorDetails,
  title,
  summary,
  date,
  lastmod,
  url,
  tags,
  images = [],
  canonicalUrl,
  noindex,
}: BlogSeoProps & { tags?: string[] }) => {
  const publishedAt = new Date(date).toISOString()
  const modifiedAt = new Date(lastmod || date).toISOString()
  const imagesArr =
    images.length === 0
      ? [siteMetadata.socialBanner]
      : typeof images === 'string'
      ? [images]
      : images

  const featuredImages = imagesArr.map((img) => {
    return {
      '@type': 'ImageObject',
      url: img.includes('http') ? img : siteMetadata.siteUrl + img,
    }
  })

  // With explicit authors, emit full Person objects (name + off-site profiles for
  // E-E-A-T). Otherwise reference the site-wide Person declared in _document, so the
  // graph stays consistent and the author entity is described in exactly one place.
  let authorList
  if (authorDetails) {
    authorList = authorDetails.map((author) => {
      const sameAs = [author.github, author.twitter, author.linkedin].filter(Boolean)
      return {
        '@type': 'Person',
        name: author.name,
        ...(author.github ? { url: author.github } : {}),
        ...(sameAs.length ? { sameAs } : {}),
      }
    })
  } else {
    authorList = { '@id': `${siteMetadata.siteUrl}/#person` }
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        url,
        headline: title,
        name: title,
        description: summary,
        image: featuredImages,
        datePublished: publishedAt,
        dateModified: modifiedAt,
        inLanguage: 'zh-CN',
        ...(tags && tags.length
          ? { keywords: tags.join(', '), articleSection: tags }
          : {}),
        author: authorList,
        publisher: {
          '@type': 'Organization',
          name: siteMetadata.title,
          logo: {
            '@type': 'ImageObject',
            url: `${siteMetadata.siteUrl}${siteMetadata.siteLogo}`,
          },
        },
        isPartOf: { '@id': `${siteMetadata.siteUrl}/#website` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '首页', item: siteMetadata.siteUrl },
          {
            '@type': 'ListItem',
            position: 2,
            name: '博客',
            item: `${siteMetadata.siteUrl}/blog`,
          },
          { '@type': 'ListItem', position: 3, name: title, item: url },
        ],
      },
    ],
  }

  const twImageUrl = featuredImages[0].url

  return (
    <>
      <CommonSEO
        title={title}
        description={summary}
        ogType="article"
        ogImage={featuredImages}
        twImage={twImageUrl}
        canonicalUrl={canonicalUrl}
        noindex={noindex}
      />
      <Head>
        {date && <meta property="article:published_time" content={publishedAt} />}
        {lastmod && <meta property="article:modified_time" content={modifiedAt} />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData, null, 2),
          }}
        />
      </Head>
    </>
  )
}
