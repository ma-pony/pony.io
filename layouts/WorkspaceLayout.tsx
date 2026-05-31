import type { ReactNode } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Workspace, Authors } from 'contentlayer/generated'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import { BlogSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'

const postDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

interface LayoutProps {
  content: CoreContent<Workspace>
  authorDetails: CoreContent<Authors>[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
}

export default function WorkspaceLayout({
  content,
  authorDetails,
  next,
  prev,
  children,
}: LayoutProps) {
  const { path, slug, date, title, summary } = content

  return (
    <SectionContainer>
      <BlogSEO url={`${siteMetadata.siteUrl}/${path}`} authorDetails={authorDetails} {...content} />
      <ScrollTopAndComment />
      <article>
        <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
          <header className="pt-6 xl:pb-6">
            <div className="space-y-1 text-center">
              <dl className="space-y-10">
                <div>
                  <dt className="sr-only">Updated on</dt>
                  <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                    <time dateTime={date}>
                      {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
                    </time>
                  </dd>
                </div>
              </dl>
              <PageTitle>{title}</PageTitle>
              {summary && (
                <p className="mx-auto max-w-2xl text-base leading-7 text-gray-500 dark:text-gray-400">
                  {summary}
                </p>
              )}
            </div>
          </header>
          <div className="grid-rows-[auto_1fr] divide-y divide-gray-200 pb-8 dark:divide-gray-700 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0">
            <aside className="pt-6 pb-10 xl:border-b xl:border-gray-200 xl:pt-11 xl:dark:border-gray-700">
              <div className="space-y-6 text-sm leading-6 text-gray-600 dark:text-gray-300">
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Workspace
                  </h2>
                  <p className="mt-2">Obsidian 白名单同步的远程阅读版。</p>
                </div>
                <dl className="space-y-2 break-words text-xs text-gray-500 dark:text-gray-400">
                  <div>
                    <dt className="font-semibold">Path</dt>
                    <dd>{path}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Slug</dt>
                    <dd>{slug}</dd>
                  </div>
                </dl>
              </div>
            </aside>
            <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-3 xl:row-span-2 xl:pb-0">
              <div className="prose max-w-none pt-10 pb-8 dark:prose-dark">{children}</div>
              {(next || prev) && (
                <nav className="flex justify-between gap-4 pt-6 pb-6 text-sm font-medium leading-5">
                  <div>
                    {prev && (
                      <Link
                        href={`/${prev.path}`}
                        className="text-primary-500 hover:text-primary-600"
                      >
                        &larr; {prev.title}
                      </Link>
                    )}
                  </div>
                  <div className="text-right">
                    {next && (
                      <Link
                        href={`/${next.path}`}
                        className="text-primary-500 hover:text-primary-600"
                      >
                        {next.title} &rarr;
                      </Link>
                    )}
                  </div>
                </nav>
              )}
            </div>
            <footer>
              <div className="pt-4 xl:pt-8">
                <Link
                  href="/workspace"
                  className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                  aria-label="Back to workspace"
                >
                  &larr; Back to workspace
                </Link>
              </div>
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
