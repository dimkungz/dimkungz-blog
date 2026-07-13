import { useEffect, useState } from 'react'
import { isAdminLoggedIn } from '@/lib/admin'

export function useAdminLoggedIn() {
  const [isAdmin, setIsAdmin] = useState(isAdminLoggedIn)

  useEffect(() => {
    const syncAdmin = () => setIsAdmin(isAdminLoggedIn())
    window.addEventListener('admin-auth-change', syncAdmin)
    window.addEventListener('storage', syncAdmin)
    return () => {
      window.removeEventListener('admin-auth-change', syncAdmin)
      window.removeEventListener('storage', syncAdmin)
    }
  }, [])

  return isAdmin
}
