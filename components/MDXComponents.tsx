/* eslint-disable react/display-name */
import React from 'react'
import type { MDXComponents as MDXComponentsType } from 'mdx/types'
import { useMDXComponent } from 'next-contentlayer2/hooks'
import TOCInline from 'pliny/ui/TOCInline'
import Pre from 'pliny/ui/Pre'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm'

import Image from './Image'
import CustomLink from './Link'
import PostLayout from '../layouts/PostLayout'
import PostSimple from '../layouts/PostSimple'
import AuthorLayout from '../layouts/AuthorLayout'
import WorkspaceLayout from '../layouts/WorkspaceLayout'
import ListLayout from '../layouts/ListLayout'

interface WrapperProps {
  layout: string
  content: Record<string, unknown>
  [key: string]: unknown
}

// Static layout registry. (A dynamic `require(`../layouts/${layout}`)` returns an
// empty module in the webpack server bundle, so the layout must be statically known.)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const layouts: Record<string, any> = {
  PostLayout,
  PostSimple,
  AuthorLayout,
  WorkspaceLayout,
  ListLayout,
}

// MDXLayoutRenderer forwards layout/content/toc/... to the MDX `wrapper`,
// which selects the page layout (PostLayout / PostSimple / ...).
export const Wrapper = ({ layout, content, ...rest }: WrapperProps) => {
  const Layout = layouts[layout] || PostLayout
  return <Layout content={content} {...rest} />
}

export const MDXComponents: MDXComponentsType = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  wrapper: Wrapper,
  BlogNewsletterForm,
}

// contentlayer2's compiled MDX returns the component directly (not `.default`),
// so use next-contentlayer2's own hook rather than pliny's mismatched renderer.
// The generated code still honors `components.wrapper`, so layout injection works.
interface MDXLayoutRendererProps {
  code: string
  components?: MDXComponentsType
  [key: string]: unknown
}

export function MDXLayoutRenderer({ code, components, ...rest }: MDXLayoutRendererProps) {
  const Mdx = useMDXComponent(code)
  return <Mdx components={components} {...rest} />
}
