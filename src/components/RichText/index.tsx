import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { DefaultNodeTypes, SerializedBlockNode } from '@payloadcms/richtext-lexical'
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import {
  JSXConvertersFunction,
  RichText as RichTextWithoutBlocks,
} from '@payloadcms/richtext-lexical/react'

import { CodeBlock, CodeBlockProps } from '@/blocks/Code/Component'

import type {
  BannerBlock as BannerBlockProps,
  CallToActionBlock as CTABlockProps,
  MediaBlock as MediaBlockProps,
} from '@/payload-types'
import { BannerBlock } from '@/blocks/Banner/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { cn } from '@/utilities/cn'

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<CTABlockProps | MediaBlockProps | BannerBlockProps | CodeBlockProps>

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  blocks: {
    banner: ({ node }) => <BannerBlock className="col-start-2 mb-4" {...node.fields} />,
    mediaBlock: ({ node }) => (
      <MediaBlock
        className="col-start-1 col-span-3"
        imgClassName="m-0"
        {...node.fields}
        captionClassName="mx-auto max-w-3xl"
        enableGutter={false}
        disableInnerContainer={true}
      />
    ),
    code: ({ node }) => <CodeBlock className="col-start-2" {...node.fields} />,
    cta: ({ node }) => <CallToActionBlock {...node.fields} />,
  },
})

// Brand-styled typography: editorial serif headings, olive-grey body, bronze links, hairline rules.
const brandProse = [
  'mx-auto prose max-w-2xl text-[1.0625rem] leading-[1.85] text-ink/85',
  'prose-headings:font-display prose-headings:font-light prose-headings:tracking-[-0.02em] prose-headings:text-ink',
  'prose-h2:mt-14 prose-h2:text-3xl prose-h3:mt-10 prose-h3:text-2xl',
  'prose-p:text-ink/80 prose-strong:font-semibold prose-strong:text-ink',
  'prose-a:text-bronze-deep prose-a:underline-offset-4 hover:prose-a:text-bronze',
  'prose-blockquote:border-l-bronze prose-blockquote:font-display prose-blockquote:text-2xl prose-blockquote:font-light prose-blockquote:not-italic prose-blockquote:text-ink',
  'prose-li:marker:text-bronze prose-hr:border-ink/15',
  'prose-img:rounded-none',
].join(' ')

type Props = {
  data: SerializedEditorState
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export const RichText: React.FC<Props> = (props) => {
  const { className, enableProse = true, enableGutter = true, ...rest } = props
  return (
    <RichTextWithoutBlocks
      converters={jsxConverters}
      className={cn(
        {
          'container ': enableGutter,
          'max-w-none': !enableGutter,
          [brandProse]: enableProse,
        },
        className,
      )}
      {...rest}
    />
  )
}
