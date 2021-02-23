import MarkdownOriginal, { MarkdownToJSX } from 'markdown-to-jsx'
import React from 'react'
import { A, Pre } from '@/components'

export default function Markdown(props: {
  [key: string]: any
  children: string
  options?: MarkdownToJSX.Options
}) {
  return (
    <MarkdownOriginal
      {...props}
      options={{
        ...(props?.options ?? {}),
        wrapper: React.Fragment,
        overrides: {
          ...(props?.options?.overrides ?? {}),
          a: {
            component: A,
          },
          pre: {
            component: Pre,
          },
        },
      }}
    />
  )
}
