import { NavBar, Button, Menu, Avatar } from '@/ui'
import { signIn, signOut, useSession } from 'next-auth/client'
import { Logo, DonateModal, GlobalLoadingIndicator, A } from '@/components'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { User } from 'src/pages/members'
import { Toggle } from '@/ui'
import { Gear, RocketLaunch, SignOut, UserCircle } from 'phosphor-react'
import { useState } from 'react'
import { useQuery } from 'react-query'
import classNames from 'classnames'

const navbarItems = [
  {
    title: 'Members',
    value: 'members',
    href: '/members',
  },
  {
    title: 'Chatroom',
    value: 'chatroom',
    href: 'https://chat.coderplex.org',
  },
]

export default function AppNavBar() {
  const [session, loading] = useSession()
  const router = useRouter()
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false)
  const mobileItems = [
    ...navbarItems,
    ...(session
      ? [
          {
            title: 'Your Profile',
            value: 'your-profile',
            href: session && (session.user as User).username,
          },
          {
            title: 'Your Goal',
            value: 'your-goal',
            href: session && (session.user as User).username,
          },
          {
            title: 'Settings',
            value: 'settings',
            href: '/profile/settings',
          },
          {
            title: 'Report Bug',
            value: 'report-bug',
            href: 'https://github.com/coderplex-org/coderplex-org/issues/new',
          },
        ]
      : []),
  ]
  const { data: notificationsCount } = useQuery(
    'api/fauna/has-notifications',
    () => {
      return fetch(`/api/fauna/has-notifications`).then((res) => res.json())
    }
  )

  return (
    <NavBar
      className="border-b border-gray-200 shadow-none"
      logo={<Logo className="hidden lg:block" />}
      leftDesktopItems={
        <>
          {navbarItems.map((item) => (
            <Link href={item.href} passHref={true} key={item.value}>
              <NavBar.Item.Desktop.Left
                isSelected={router.asPath === item.href}
              >
                {item.title}
              </NavBar.Item.Desktop.Left>
            </Link>
          ))}
        </>
      }
      rightDesktopItems={
        <>
          <GlobalLoadingIndicator />
          <DonateModal
            isOpen={isDonateModalOpen}
            setIsOpen={setIsDonateModalOpen}
          />

          {loading && <p>loading....</p>}
          {!loading &&
            (session ? (
              <>
                <Toggle />

                <Button
                  variant="solid"
                  variantColor="success"
                  onClick={() => setIsDonateModalOpen(true)}
                >
                  Donate
                </Button>

                <A href="/notifications">
                  <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <span className="sr-only">View notifications</span>
                    <span className="flex items-center relative">
                      <div className="border border-gray-300 rounded-full p-1">
                        <svg
                          className={classNames(
                            'h-6 w-6',
                            notificationsCount > 0 && 'text-gray-900'
                          )}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                          />
                        </svg>
                      </div>
                      {notificationsCount > 0 && (
                        <span className="absolute -top-1 -right-1 block h-4 w-4 rounded-full ring-2 ring-white bg-red-400 text-white text-xs dark:text-white">
                          {notificationsCount}
                        </span>
                      )}
                    </span>
                  </button>
                </A>

                <Menu
                  trigger={
                    <Avatar
                      size="sm"
                      className="cursor-pointer"
                      src={session.user.image}
                    />
                  }
                  className="z-10 ml-3"
                >
                  <Link
                    href={`/${(session.user as User).username}`}
                    passHref={true}
                  >
                    <Menu.Item icon={UserCircle}>Your Profile</Menu.Item>
                  </Link>
                  <Link
                    href={`/${(session.user as User).username}`}
                    passHref={true}
                  >
                    <Menu.Item icon={RocketLaunch}>Your Goal</Menu.Item>
                  </Link>
                  <Link href="/profile/settings" passHref={true}>
                    <Menu.Item icon={Gear}>Settings</Menu.Item>
                  </Link>
                  <Menu.Item onClick={() => signOut()} icon={SignOut}>
                    Sign Out
                  </Menu.Item>
                </Menu>
              </>
            ) : (
              <>
                <Toggle />

                <Button
                  variant="solid"
                  variantColor="success"
                  onClick={() => setIsDonateModalOpen(true)}
                >
                  Donate
                </Button>
                <Button
                  variant="solid"
                  variantColor="brand"
                  onClick={() => signIn('github')}
                >
                  Login
                </Button>
              </>
            ))}
        </>
      }
      mobileItems={
        <>
          {mobileItems.map((item) => (
            <Link href={item.href} passHref={true} key={item.value}>
              <NavBar.Item.Mobile.Left isSelected={router.asPath === item.href}>
                {item.title}
              </NavBar.Item.Mobile.Left>
            </Link>
          ))}
        </>
      }
    />
  )
}
