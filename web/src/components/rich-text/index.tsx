import type {
  DefaultNodeTypes,
  DefaultTypedEditorState,
  SerializedBlockNode,
  SerializedLinkNode,
} from '@payloadcms/richtext-lexical'
import {
  RichText as ConvertRichText,
  type JSXConvertersFunction,
  LinkJSXConverter,
} from '@payloadcms/richtext-lexical/react'
import { useLocale } from 'next-intl'
import { BannerBlock } from '@/blocks/banner/component'
import { CallToActionBlock } from '@/blocks/call-to-action/component'

import { CodeBlock, type CodeBlockProps } from '@/blocks/code/component'
import { MediaBlock } from '@/blocks/media-block/component'
import { type Locale, localizedPath } from '@/i18n/config'
import type {
  BannerBlock as BannerBlockProps,
  CallToActionBlock as CTABlockProps,
  MediaBlock as MediaBlockProps,
} from '@/payload-types'
import shared from '@/styles/shared.module.css'
import { cn } from '@/utilities/ui'
import styles from './index.module.css'

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<CTABlockProps | MediaBlockProps | BannerBlockProps | CodeBlockProps>

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const doc = linkNode.fields.doc
  if (!doc) return '/'
  const { value, relationTo } = doc
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = value.slug
  return relationTo === 'posts' ? `/posts/${slug}` : slug === 'home' ? '/' : `/${slug}`
}

const jsxConverters =
  (locale: Locale): JSXConvertersFunction<NodeTypes> =>
  ({ defaultConverters }) => ({
    ...defaultConverters,
    ...LinkJSXConverter({
      internalDocToHref: (args) => localizedPath(internalDocToHref(args), locale),
    }),
    link: (args) => {
      const converter = LinkJSXConverter({
        internalDocToHref: (args) => localizedPath(internalDocToHref(args), locale),
      }).link
      const node = args.node
      if (typeof converter !== 'function') return converter
      return converter({
        ...args,
        node: {
          ...node,
          fields: {
            ...node.fields,
            url: node.fields.url ? localizedPath(node.fields.url, locale) : node.fields.url,
          },
        },
      })
    },
    blocks: {
      banner: ({ node }) => <BannerBlock className={styles.banner} {...node.fields} />,
      mediaBlock: ({ node }) => (
        <MediaBlock
          className={styles.mediaBlock}
          imgClassName={styles.mediaImage}
          {...node.fields}
          captionClassName={styles.caption}
          enableGutter={false}
          disableInnerContainer={true}
        />
      ),
      code: ({ node }) => <CodeBlock className={styles.code} {...node.fields} />,
      cta: ({ node }) => <CallToActionBlock {...node.fields} />,
    },
  })

type Props = {
  data: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
  const locale = useLocale()
  const { className, enableProse = true, enableGutter = true, ...rest } = props
  return (
    <ConvertRichText
      converters={jsxConverters(locale)}
      className={cn(
        styles.root,
        {
          [shared.container]: enableGutter,
          [styles.withoutGutter]: !enableGutter,
          [cn(shared.prose, styles.prose)]: enableProse,
        },
        className,
      )}
      {...rest}
    />
  )
}
