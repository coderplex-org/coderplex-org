import Head from 'next/head'
import { useRouter } from 'next/router'

export default function Meta() {
  const baseUrl = 'https://coderplex.org'
  const router = useRouter()
  return (
    <Head>
      <meta charSet="utf-8" key="charSet" />
      <meta
        name="viewport"
        content="initial-scale=1.0, width=device-width"
        key="viewport"
      />
      <meta
        key="twitter:card"
        name="twitter:card"
        content="summary_large_image"
      />
      <meta key="twitter:site" name="twitter:site" content="@coderplex_org" />
      <meta
        key="twitter:image"
        name="twitter:image"
        content={`${baseUrl}/logo.svg`}
      />
      <meta
        key="twitter:creator"
        name="twitter:creator"
        content="@pbteja1998"
      />
      <meta
        key="og:url"
        property="og:url"
        content={`${baseUrl}${router.pathname}`}
      />
      <meta key="og:type" property="og:type" content="website" />
      <meta
        key="og:image"
        property="og:image"
        content={`${baseUrl}/logo.svg`}
      />
    </Head>
  )
}
