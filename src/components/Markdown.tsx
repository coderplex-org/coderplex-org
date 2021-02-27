import MarkdownOriginal, { MarkdownToJSX } from 'markdown-to-jsx'
import React from 'react'
import { A, Pre } from '@/components'
import { CodePen, Gist, Tweet, YouTube, CodeSandbox } from 'mdx-embed'

function Repl({ replLink }: { replLink: string }) {
  return (
    <>
      <iframe
        title={`repl-${replLink}`}
        height="400px"
        width="100%"
        src={`https://repl.it/${replLink}?lite=true`}
        scrolling="no"
        frameBorder="no"
        allowTransparency={true}
        allowFullScreen={true}
        sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"
      />
    </>
  )
}

function Glitch({ glitchId }: { glitchId: string }) {
  return (
    <div
      className="glitch-embed-wrap"
      style={{ height: '420px', width: '100%' }}
    >
      <iframe
        src={`https://glitch.com/embed/#!/embed/${glitchId}`}
        title="probable-stellar-gull on Glitch"
        allow="geolocation; microphone; camera; midi; vr; encrypted-media"
        style={{ height: '100%', width: '100%', border: 0 }}
      ></iframe>
    </div>
  )
}

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
          CodePen: {
            component: CodePen,
          },
          Gist: {
            component: Gist,
          },
          Tweet: {
            component: Tweet,
          },
          YouTube: {
            component: YouTube,
          },
          CodeSandbox: {
            component: CodeSandbox,
          },
          Repl: {
            component: Repl,
          },
          Glitch: {
            component: Glitch,
          },
        },
      }}
    />
  )
}
