import MarkdownOriginal, { MarkdownToJSX } from 'markdown-to-jsx'
import React from 'react'
import { A, Pre } from '@/components'
import { CodePen, Gist, Tweet, YouTube, CodeSandbox } from 'mdx-embed'

function Repl({ id }: { id: string }) {
  return (
    <>
      <details>
        <summary>Show Repl</summary>
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
      </details>
    </>
  )
}

function Glitch({ id }: { id: string }) {
  return (
    <details>
      <summary>Show Glitch</summary>
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
    </details>
  )
}

function Video({ id }: { id: string }) {
  return (
    <details>
      <summary>Show Video</summary>
      <video controls>
        <source src={id} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </details>
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
            component: ({ id }: { id: string }) => (
              <details>
                <summary>Show CodePen</summary>
                <CodePen codePenId={id} />
              </details>
            ),
          },
          Gist: {
            component: ({ id }: { id: string }) => (
              <details>
                <summary>Show GitHub Gist</summary>
                <Gist gistLink={id} />
              </details>
            ),
          },
          Tweet: {
            component: ({ id }: { id: string }) => (
              <details>
                <summary>Show Tweet</summary>
                <Tweet tweetLink={id} />
              </details>
            ),
          },
          YouTube: {
            component: ({ id }: { id: string }) => (
              <details>
                <summary>Show YouTube video</summary>
                <YouTube youTubeId={id} />
              </details>
            ),
          },
          CodeSandbox: {
            component: ({ id }: { id: string }) => (
              <details>
                <summary>Show CodeSandbox</summary>
                <CodeSandbox codeSandboxId={id} />
              </details>
            ),
          },
          Video: {
            component: Video,
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
