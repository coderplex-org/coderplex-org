import { NavBar, Button, Menu, Avatar } from '@/ui'
import { signIn, signOut, useSession } from 'next-auth/client'
import { Logo, DonateModal } from '@/components'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { User } from 'src/pages/members'
import { Toggle } from '@/ui'
import { Gear, RocketLaunch, SignOut, UserCircle } from 'phosphor-react'
import { useState } from 'react'

const navbarItems = [
  {
    title: 'Home',
    value: 'home',
    href: '/',
  },
  {
    title: 'Members',
    value: 'members',
    href: '/members',
  },
  {
    title: 'Our Chatroom',
    value: 'our-chatroom',
    href: '/chat',
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
        ]
      : []),
  ]

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
