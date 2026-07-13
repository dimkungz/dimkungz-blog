import { Link, useNavigate } from 'react-router-dom'
import {
  Bell,
  ExternalLink,
  FileText,
  FolderOpen,
  LogOut,
  RotateCcw,
  User,
} from 'lucide-react'
import { adminLogout } from '@/lib/admin'
import { clearAdminNotifications } from '@/lib/notifications'
import { cn } from '@/lib/utils'

const navItems = [
  { id: 'articles', label: 'Article management', icon: FileText, to: '/admin/articles' },
  { id: 'categories', label: 'Category management', icon: FolderOpen, to: '/admin/categories' },
  { id: 'profile', label: 'Profile', icon: User, to: '/admin/profile' },
  { id: 'notifications', label: 'Notification', icon: Bell, to: '/admin/notifications' },
  { id: 'reset-password', label: 'Reset password', icon: RotateCcw, to: '/admin/reset-password' },
]

export function AdminSidebar({ activePage }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    adminLogout()
    clearAdminNotifications()
    navigate('/')
  }

  const linkClass = (page) =>
    cn(
      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
      activePage === page
        ? 'bg-stone-200/70 font-medium text-stone-900'
        : 'text-stone-500 hover:bg-stone-200/40 hover:text-stone-900'
    )

  const iconClass = (page) =>
    activePage === page ? 'text-stone-600' : 'text-stone-400'

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-stone-200 bg-neutral-100 px-4 py-6 lg:sticky lg:top-0 lg:h-screen lg:w-56 lg:border-r lg:border-b-0 lg:py-8">
      <div className="mb-6 shrink-0 lg:mb-10">
        <Link
          to="/admin/articles"
          className="text-2xl font-bold tracking-tight text-stone-900"
        >
          hh<span className="text-emerald-500">.</span>
        </Link>
        <p className="mt-1 text-sm font-medium text-orange-500">Admin panel</p>
      </div>

      <nav className="flex flex-1 flex-wrap gap-1 lg:flex-col">
        {navItems.map(({ id, label, icon: Icon, to }) => (
          <Link key={id} to={to} className={linkClass(id)}>
            <Icon className={cn('h-4 w-4 shrink-0', iconClass(id))} />
            {label}
          </Link>
        ))}
      </nav>

      <nav className="mt-6 flex shrink-0 flex-wrap gap-1 border-t border-stone-200 pt-4 lg:mt-0 lg:flex-col">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-stone-500 transition-colors hover:bg-stone-200/40 hover:text-stone-900"
        >
          <ExternalLink className="h-4 w-4 shrink-0 text-stone-400" />
          hh. website
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-stone-500 transition-colors hover:bg-stone-200/40 hover:text-stone-900"
        >
          <LogOut className="h-4 w-4 shrink-0 text-stone-400" />
          Log out
        </button>
      </nav>
    </aside>
  )
}
