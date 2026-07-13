import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Bell,
  ChevronDown,
  LogOut,
  RotateCcw,
  User,
} from 'lucide-react'
import heroPic from '../assets/heropic.jpg'
import { GithubIcon, SocialIconLink } from '@/components/ui/icon'
import { DEFAULT_AVATAR, logout } from '@/lib/auth'
import { useAuthUser } from '@/hooks/useAuthUser'
import {
  getNotifications,
  getUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
} from '@/lib/notifications'

function useNotifications() {
  const [notifications, setNotifications] = useState(getNotifications)
  const [unreadCount, setUnreadCount] = useState(getUnreadCount)

  useEffect(() => {
    const syncNotifications = () => {
      setNotifications(getNotifications())
      setUnreadCount(getUnreadCount())
    }

    window.addEventListener('notifications-change', syncNotifications)
    window.addEventListener('storage', syncNotifications)
    return () => {
      window.removeEventListener('notifications-change', syncNotifications)
      window.removeEventListener('storage', syncNotifications)
    }
  }, [])

  return { notifications, unreadCount }
}

function useClickOutside(ref, handler, enabled) {
  useEffect(() => {
    if (!enabled) return undefined

    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handler()
      }
    }

    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [ref, handler, enabled])
}

function LoggedInNavActions({ onMobileNavigate, variant = 'desktop' }) {
  const navigate = useNavigate()
  const user = useAuthUser()
  const { notifications, unreadCount } = useNotifications()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const notificationsRef = useRef(null)
  const profileRef = useRef(null)

  useClickOutside(notificationsRef, () => setShowNotifications(false), showNotifications)
  useClickOutside(profileRef, () => setShowProfileMenu(false), showProfileMenu)

  if (!user) return null

  const handleLogout = () => {
    logout()
    setShowProfileMenu(false)
    onMobileNavigate?.()
    navigate('/')
  }

  const handleToggleNotifications = () => {
    setShowNotifications((open) => {
      const nextOpen = !open
      if (nextOpen && unreadCount > 0) {
        markAllNotificationsRead()
      }
      return nextOpen
    })
    setShowProfileMenu(false)
  }

  const handleToggleProfileMenu = () => {
    setShowProfileMenu((open) => !open)
    setShowNotifications(false)
  }

  const profileMenuItems = [
    {
      label: 'Profile',
      icon: User,
      onClick: () => {
        setShowProfileMenu(false)
        onMobileNavigate?.()
        navigate('/profile')
      },
    },
    {
      label: 'Reset password',
      icon: RotateCcw,
      onClick: () => {
        setShowProfileMenu(false)
        onMobileNavigate?.()
        navigate('/reset-password')
      },
    },
    { label: 'Log out', icon: LogOut, onClick: handleLogout },
  ]

  const userAvatar = user.avatar || DEFAULT_AVATAR

  if (variant === 'mobile') {
    return (
      <div className="flex w-full flex-col gap-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={userAvatar}
              alt={user.name}
              className="h-10 w-10 shrink-0 rounded-full object-cover"
            />
            <span className="truncate text-sm font-medium text-stone-900">{user.name}</span>
          </div>

          <div ref={notificationsRef} className="relative shrink-0">
            <button
              type="button"
              onClick={handleToggleNotifications}
              className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 shadow-sm transition-colors hover:bg-stone-50"
              aria-label="Notifications"
              aria-expanded={showNotifications}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full z-50 mt-2 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-lg">
                <div className="border-b border-stone-100 px-4 py-3">
                  <p className="text-sm font-semibold text-stone-900">Notifications</p>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="px-4 py-6 text-center text-sm text-stone-500">
                      No notifications yet
                    </p>
                  ) : (
                    notifications.map((notification) => (
                      <button
                        key={notification.id}
                        type="button"
                        onClick={() => markNotificationRead(notification.id)}
                        className={`flex w-full cursor-pointer flex-col gap-1 border-b border-stone-100 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-stone-50 ${
                          notification.read ? 'bg-white' : 'bg-stone-50/80'
                        }`}
                      >
                        <span className="text-sm font-medium text-stone-900">
                          {notification.title}
                        </span>
                        <span className="text-sm text-stone-500">{notification.message}</span>
                        <span className="text-xs text-stone-400">{notification.time}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          {profileMenuItems.slice(0, -1).map(({ label, icon: Icon, onClick }) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                onClick()
                onMobileNavigate?.()
              }}
              className="flex w-full cursor-pointer items-center gap-3 py-3 text-left text-sm text-stone-700 transition-colors hover:text-stone-900"
            >
              <Icon className="h-5 w-5 text-stone-400" />
              {label}
            </button>
          ))}

          <div className="my-1 border-t border-stone-200" />

          <button
            type="button"
            onClick={() => {
              handleLogout()
              onMobileNavigate?.()
            }}
            className="flex w-full cursor-pointer items-center gap-3 pt-3 text-left text-sm text-stone-700 transition-colors hover:text-stone-900"
          >
            <LogOut className="h-5 w-5 text-stone-400" />
            Log out
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div ref={notificationsRef} className="relative">
        <button
          type="button"
          onClick={handleToggleNotifications}
          className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 transition-colors hover:bg-stone-50"
          aria-label="Notifications"
          aria-expanded={showNotifications}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
          )}
        </button>

        {showNotifications && (
          <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-lg">
            <div className="border-b border-stone-100 px-4 py-3">
              <p className="text-sm font-semibold text-stone-900">Notifications</p>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-stone-500">
                  No notifications yet
                </p>
              ) : (
                notifications.map((notification) => (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => markNotificationRead(notification.id)}
                    className={`flex w-full cursor-pointer flex-col gap-1 border-b border-stone-100 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-stone-50 ${
                      notification.read ? 'bg-white' : 'bg-stone-50/80'
                    }`}
                  >
                    <span className="text-sm font-medium text-stone-900">
                      {notification.title}
                    </span>
                    <span className="text-sm text-stone-500">{notification.message}</span>
                    <span className="text-xs text-stone-400">{notification.time}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <div ref={profileRef} className="relative">
        <button
          type="button"
          onClick={handleToggleProfileMenu}
          className="flex cursor-pointer items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-stone-100 sm:gap-3 sm:pr-3"
          aria-label="Open profile menu"
          aria-expanded={showProfileMenu}
        >
          <img
            src={userAvatar}
            alt={user.name}
            className="h-9 w-9 rounded-full object-cover sm:h-10 sm:w-10"
          />
          <span className="hidden max-w-[120px] truncate text-sm font-medium text-stone-900 sm:inline sm:max-w-none">
            {user.name}
          </span>
          <ChevronDown
            className={`hidden h-4 w-4 text-stone-500 transition-transform sm:block ${
              showProfileMenu ? 'rotate-180' : ''
            }`}
          />
        </button>

        {showProfileMenu && (
          <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-stone-200 bg-white py-2 shadow-lg">
            {profileMenuItems.map(({ label, icon: Icon, onClick }) => (
              <button
                key={label}
                type="button"
                onClick={onClick}
                className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-sm text-stone-700 transition-colors hover:bg-stone-50"
              >
                <Icon className="h-4 w-4 text-stone-400" />
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [headerHeight, setHeaderHeight] = useState(0)
  const topBarRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const user = useAuthUser()

  const loginButtonClass =
    'cursor-pointer rounded-full border border-stone-900 px-6 py-2 text-sm font-medium text-stone-900 transition-colors hover:bg-stone-100 sm:px-8 sm:py-2.5'
  const signupButtonClass =
    'cursor-pointer rounded-full bg-stone-900 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-800 sm:px-8 sm:py-2.5'

  const loginNavClass = loginButtonClass 
  const signupNavClass = signupButtonClass
  const closeMobileMenu = () => setIsMenuOpen(false)

  useEffect(() => {
    setIsMenuOpen(false)
    document.body.style.overflow = ''
    window.scrollTo(0, 0)
  }, [location.pathname])

  useLayoutEffect(() => {
    const updateHeaderHeight = () => {
      if (topBarRef.current) {
        setHeaderHeight(topBarRef.current.offsetHeight)
      }
    }

    updateHeaderHeight()
    window.addEventListener('resize', updateHeaderHeight)

    return () => window.removeEventListener('resize', updateHeaderHeight)
  }, [isMenuOpen, user])

  useEffect(() => {
    if (!isMenuOpen) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isMenuOpen])

  const handleLogoClick = () => {
    closeMobileMenu()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white">
      <div
        ref={topBarRef}
        className="relative z-60 mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4"
      >
        <Link
          to="/"
          onClick={handleLogoClick}
          className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl"
        >
          hh<span className="text-emerald-500">.</span>
        </Link>

        {user ? (
          <div className="hidden items-center gap-3 md:flex">
            <LoggedInNavActions />
          </div>
        ) : (
          <div className="hidden items-center gap-2 md:flex">
            <Link to="/login" className={loginNavClass}>
              Log in
            </Link>
            <Link to="/signup" className={signupNavClass}>
              Sign up
            </Link>
          </div>
        )}

        <button
          type="button"
          className="flex cursor-pointer flex-col justify-center gap-1.5 p-2 md:hidden"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
        >
          <span
            className={`block h-0.5 w-6 bg-stone-900 transition-transform duration-200 ${
              isMenuOpen ? 'translate-y-2 rotate-45' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-stone-900 transition-opacity duration-200 ${
              isMenuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-stone-900 transition-transform duration-200 ${
              isMenuOpen ? '-translate-y-2 -rotate-45' : ''
            }`}
          />
        </button>
      </div>

      {isMenuOpen && (
        <>
          <button
            type="button"
            className="fixed inset-x-0 bottom-0 z-40 bg-black/20 md:hidden"
            style={{ top: headerHeight }}
            onClick={closeMobileMenu}
            aria-label="Close menu"
          />

          <div
            className="fixed inset-x-0 z-40 border-t border-stone-200 bg-white shadow-lg md:hidden"
            style={{ top: headerHeight }}
          >
            <div className="mx-auto max-w-6xl px-4 py-5">
              {user ? (
                <LoggedInNavActions variant="mobile" onMobileNavigate={closeMobileMenu} />
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className={`w-full text-center ${loginNavClass}`}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={closeMobileMenu}
                    className={`w-full text-center ${signupNavClass}`}
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  )
}

export function HeroSection() {
  return (
    <main className="mx-auto mt-12 w-full max-w-6xl px-6 pb-16 sm:px-10 sm:pb-18">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-8 xl:gap-12">
        <div className="order-1 flex flex-col gap-4 text-center lg:order-0 lg:items-end lg:text-right">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-stone-900 sm:text-4xl lg:pl-2 lg:text-[2.75rem] lg:leading-[1.15]">
            Stay Informed,
            <br />
            Stay Inspired
          </h1>
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-stone-500 sm:text-base lg:ml-auto lg:mr-0">
            Discover a World of Knowledge at Your Fingertips. Your Daily Dose of
            Inspiration and Information.
          </p>
        </div>

        <div className="order-2 flex justify-center lg:order-0">
          <div className="aspect-3/4 w-full  overflow-hidden rounded-3xl  lg:max-w-[320px] xl:max-w-[360px]">
            <img
              src={heroPic}
              alt="Author with a cat on his shoulder in an autumn forest"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="order-3 mx-auto w-full max-w-sm text-left lg:order-0 lg:mx-0 lg:max-w-xs">
          <div className="flex flex-col gap-3">
            <span className="text-sm text-stone-400">-Author</span>
            <h2 className="text-xl font-bold text-stone-900 sm:text-2xl">Thompson P.</h2>
            <div className="flex flex-col gap-4 text-sm leading-relaxed text-stone-500 sm:text-base">
              <p>
                I am a pet enthusiast and freelance writer who specializes in animal
                behavior and care. With a deep love for cats, I enjoy sharing insights
                on feline companionship and wellness.
              </p>
              <p>
                When I'm not writing, I spends time volunteering at my local animal
                shelter, helping cats find loving homes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export function Footer() {
    const socialLinks = [
      { label: 'LinkedIn', href: 'https://linkedin.com', text: 'in' },
      { label: 'GitHub', href: 'https://github.com', Icon: GithubIcon },
      { label: 'Google', href: 'https://google.com', text: 'G' },
    ]
    
    return (
      <footer className="bg-neutral-100">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-6 px-6 py-8 sm:flex-row sm:px-10">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <span className="text-sm text-stone-700">Get in touch</span>
            <div className="flex items-center gap-2">
              {socialLinks.map(({ label, href, Icon, text }) => (
                <SocialIconLink
                  key={label}
                  href={href}
                  label={label}
                  Icon={Icon}
                  text={text}
                />
              ))}
            </div>
          </div>
  
          <Link
            to="/"
            className="cursor-pointer text-sm text-stone-700 underline underline-offset-2 transition-colors hover:text-stone-900"
          >
            Home page
          </Link>
        </div>
      </footer>
    )
} 