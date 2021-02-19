import { signIn } from 'next-auth/client'
import { A } from '@/components'

export default function Hero() {
  return (
    <div className="relative bg-gray-50 overflow-hidden ">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block text-brand-600 xl:inline">
              Learn. Code. Collaborate.
            </span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Our mission is to help each other to learn more, create awesome
            things, and become better developers.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <button
                onClick={() => signIn('github')}
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 md:py-4 md:text-lg md:px-10"
              >
                Join Community
              </button>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <A
                href="https://chat.coderplex.org"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-brand-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                Join Chatroom
              </A>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
