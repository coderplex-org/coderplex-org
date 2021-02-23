import Highlight, { defaultProps, Language } from 'prism-react-renderer'
import theme from 'prism-react-renderer/themes/nightOwl'

const aliasesMap: Record<Language, string[]> = {
  markup: [],
  bash: ['sh', 'shellscript'],
  clike: [],
  c: [],
  cpp: [],
  css: [],
  javascript: ['js'],
  jsx: [],
  coffeescript: [],
  actionscript: [],
  'css-extr': [],
  diff: [],
  git: [],
  go: [],
  graphql: [],
  handlebars: [],
  json: [],
  less: [],
  makefile: [],
  markdown: [],
  objectivec: [],
  ocaml: [],
  python: ['py', 'py3'],
  reason: [],
  sass: [],
  scss: [],
  sql: [],
  stylus: [],
  tsx: [],
  typescript: ['ts'],
  wasm: [],
  yaml: [],
}

function Code({
  children,
  className,
}: {
  children: string
  className: string
}) {
  let languageOfCode = (className?.split('-')?.[1] ?? '') as any
  const languages = Object.keys(aliasesMap) as Array<keyof typeof aliasesMap>
  if (!languages.includes(languageOfCode)) {
    for (const lang of languages) {
      const aliases = aliasesMap[lang]
      const match = aliases.find(
        // eslint-disable-next-line no-loop-func
        (language) => language === languageOfCode
      )
      if (match) {
        languageOfCode = lang
        break
      }
    }
  }

  return (
    <Highlight
      {...defaultProps}
      theme={theme}
      code={children}
      language={languageOfCode}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={style}>
          <code>
            {tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </code>
        </pre>
      )}
    </Highlight>
  )
}

export function Pre({ children }) {
  const props = children.props
  return <Code {...props}></Code>
}
