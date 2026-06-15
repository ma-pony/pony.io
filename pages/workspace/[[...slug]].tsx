import PageTitle from '@/components/PageTitle'
import { MDXLayoutRenderer, MDXComponents } from '@/components/MDXComponents'
import { sortedBlogPost, coreContent } from 'pliny/utils/contentlayer.js'
import { InferGetStaticPropsType } from 'next'
import { allWorkspaces, allAuthors } from 'contentlayer/generated'
import type { Workspace } from 'contentlayer/generated'

const DEFAULT_LAYOUT = 'WorkspaceLayout'

export async function getStaticPaths() {
  return {
    paths: allWorkspaces.map((p) => ({
      params: { slug: p.slug === 'index' ? [] : p.slug.split('/') },
    })),
    fallback: false,
  }
}

export const getStaticProps = async ({ params }) => {
  const slug = params?.slug?.length ? (params.slug as string[]).join('/') : ''
  const sortedPosts = sortedBlogPost(allWorkspaces) as Workspace[]
  const postIndex = sortedPosts.findIndex((p) => p.slug === slug)
  const prevContent = sortedPosts[postIndex + 1] || null
  const prev = prevContent ? coreContent(prevContent) : null
  const nextContent = sortedPosts[postIndex - 1] || null
  const next = nextContent ? coreContent(nextContent) : null
  const post = sortedPosts.find((p) => p.slug === slug)
  const authorList = post.authors || ['default']
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    return coreContent(authorResults)
  })

  return {
    props: {
      post,
      authorDetails,
      prev,
      next,
    },
  }
}

export default function WorkspacePage({
  post,
  authorDetails,
  prev,
  next,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      {'draft' in post && post.draft === true ? (
        <div className="mt-24 text-center">
          <PageTitle>Under Construction</PageTitle>
        </div>
      ) : (
        <MDXLayoutRenderer
          code={post.body.code}
          components={MDXComponents}
          layout={post.layout || DEFAULT_LAYOUT}
          content={post}
          toc={post.toc}
          authorDetails={authorDetails}
          prev={prev}
          next={next}
        />
      )}
    </>
  )
}
