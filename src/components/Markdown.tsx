import MarkdownOriginal, { MarkdownToJSX } from 'markdown-to-jsx'
import React from 'react'
import { A, Pre } from '@/components'
import { CodePen, Gist, Tweet, YouTube, CodeSandbox } from 'mdx-embed'

function Repl({ id }: { id: string }) {
  return (
    <>
      <iframe
        title={`repl-${id}`}
        height="400px"
        width="100%"
        src={`https://repl.it/${id}?lite=true`}
        scrolling="no"
        frameBorder="no"
        allowFullScreen={true}
        sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"
      />
    </>
  )
}

function Glitch({ id }: { id: string }) {
  return (
    <div
      className="glitch-embed-wrap"
      style={{ height: '420px', width: '100%' }}
    >
      <iframe
        src={`https://glitch.com/embed/#!/embed/${id}`}
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
            component: ({ id }: { id: string }) => <CodePen codePenId={id} />,
          },
          Gist: {
            component: ({ id }: { id: string }) => <Gist gistLink={id} />,
          },
          Tweet: {
            component: ({ id }: { id: string }) => <Tweet tweetLink={id} />,
          },
          YouTube: {
            component: ({ id }: { id: string }) => <YouTube youTubeId={id} />,
          },
          CodeSandbox: {
            component: ({ id }: { id: string }) => (
              <CodeSandbox codeSandboxId={id} />
            ),
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
