import { NavBar, Button, Menu, Avatar } from '@/ui'
import { signIn, signOut, useSession } from 'next-auth/client'
import { Logo } from '@/components'
import Link from 'next/link'
import { useRouter } from 'next/router'

const navbarItems = [
  {
    title: 'Home',
    value: 'home',
    href: '/',
  },
  {
    title: 'Learn',
    value: 'learn',
    href: '/learn',
  },
  {
    title: 'Events',
    value: 'events',
    href: '/events',
  },
  {
    title: 'Space',
    value: 'space',
    href: '/space',
  },
  {
    title: 'Members',
    value: 'members',
    href: '/members',
  },
  {
    title: 'Projects',
    value: 'projects',
    href: '/projects',
  },
  {
    title: 'Jobs',
    value: 'jobs',
    href: '/jobs',
  },
  {
    title: 'Notifications',
    value: 'notifications',
    href: '/notifications',
  },
]

export default function AppNavBar() {
  const [session, loading] = useSession()
  const router = useRouter()
  return (
    <NavBar
      className="border-b shadow-none"
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
          {loading && <p>loading....</p>}
          {!loading &&
            (session ? (
              <>
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
                  <Link href="/profile" passHref={true}>
                    <Menu.Item>Your Profile</Menu.Item>
                  </Link>
                  <Link href="/profile/settings" passHref={true}>
                    <Menu.Item>Settings</Menu.Item>
                  </Link>
                  <Menu.Item onClick={() => signOut()}>Sign Out</Menu.Item>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  variant="solid"
                  variantColor="brand"
                  onClick={() => signIn()}
                >
                  Log In
                </Button>
              </>
            ))}
        </>
      }
      mobileItems={
        <>
          {navbarItems.map((item) => (
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
