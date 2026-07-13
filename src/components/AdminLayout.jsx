import { Navigate } from 'react-router-dom'
import { useAdminLoggedIn } from '@/hooks/useAdminLoggedIn'
import { AdminSidebar } from '@/components/AdminSidebar'

export function AdminLayout({ activePage, children }) {
  const isAdmin = useAdminLoggedIn()

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-white lg:flex-row">
      <AdminSidebar activePage={activePage} />
      <main className="flex-1 bg-neutral-50 px-4 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
        {children}
      </main>
    </div>
  )
}
