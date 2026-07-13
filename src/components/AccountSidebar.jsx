import { Link } from 'react-router-dom'
import { RotateCcw, User } from 'lucide-react'
import { DEFAULT_AVATAR } from '@/lib/auth'
import { useAuthUser } from '@/hooks/useAuthUser'
import { cn } from '@/lib/utils'

export function AccountSidebar({ activePage }) {
  const user = useAuthUser()

  const linkClass = (page) =>
    cn(
      'flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm transition-colors',
      activePage === page
        ? 'font-medium text-stone-900'
        : 'text-stone-500 hover:text-stone-900'
    )

  const iconClass = (page) =>
    activePage === page ? 'text-stone-500' : 'text-stone-400'

  if (!user) return null

  return (
    <aside className="w-full shrink-0 lg:w-40">
      <nav className="flex flex-col gap-1">
        <Link to="/profile" className={linkClass('profile')}>
          <User className={cn('h-4 w-4', iconClass('profile'))} />
          Profile
        </Link>
        <Link to="/reset-password" className={linkClass('reset-password')}>
          <RotateCcw className={cn('h-4 w-4', iconClass('reset-password'))} />
          Reset password
        </Link>
      </nav>
    </aside>
  )
}

export function AccountPageHeader({ title }) {
  const user = useAuthUser()
  const avatar = user?.avatar || DEFAULT_AVATAR

  if (!user) return null

  return (
    <div className="mb-8 flex items-center gap-3">
      <img
        src={avatar}
        alt={user.name}
        className="h-10 w-10 rounded-full object-cover"
      />
      <span className="text-sm font-medium text-stone-900">{user.name}</span>
      <span className="h-6 w-px bg-stone-300" aria-hidden="true" />
      <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">{title}</h1>
    </div>
  )
}
