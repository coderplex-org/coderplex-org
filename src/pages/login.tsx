import { Button } from '@/ui'
import { IconBrandGithub, IconBrandLinkedin } from 'tabler-icons'
import { signIn, useSession } from 'next-auth/client'
import { GetServerSideProps } from 'next'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Logo } from '@/components'

export default function Login({ callbackUrl }) {
  const router = useRouter()
  const [session, loading] = useSession()

  useEffect(() => {
    if (loading || !session) {
      return
    }
    router.push(callbackUrl)
  }, [callbackUrl, loading, router, session])

  if (loading || session) {
    return <p>loading....</p>
  }

  return (
    <>
      <div>
        <div className="flex flex-col justify-center min-h-screen py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center sm:mx-auto sm:w-full sm:max-w-md">
            <Logo className="hidden" size={48} />
            <h2 className="mt-6 text-3xl font-extrabold leading-9 text-center text-gray-900">
              Login to your account
            </h2>
          </div>

          <div className="mt-8 mb-0 sm:mb-20 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
              <div className="grid grid-cols-1 gap-3">
                <Button
                  className="flex justify-center w-full"
                  leadingIcon={IconBrandGithub}
                  variant="solid"
                  onClick={() => signIn('github')}
                >
                  GitHub
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-3 mt-6">
                <Button
                  className="flex justify-center w-full"
                  leadingIcon={IconBrandLinkedin}
                  variant="solid"
                  variantColor="brand"
                  onClick={() => signIn('linkedin')}
                >
                  LinkedIn
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      callbackUrl: context.query.callbackUrl ?? '/',
    },
  }
}

Login.layoutProps = {
  meta: {
    title: 'Login',
  },
}
