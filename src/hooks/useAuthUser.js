import { useEffect, useState } from 'react'
import { getCurrentUser, restoreSession } from '@/lib/auth'

export function useAuthUser() {
  const [user, setUser] = useState(getCurrentUser)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let isMounted = true

    const syncUser = async () => {
      const restored = await restoreSession()
      if (isMounted) {
        setUser(restored ?? getCurrentUser())
        setIsReady(true)
      }
    }

    const handleAuthChange = () => setUser(getCurrentUser())

    syncUser()
    window.addEventListener('auth-change', handleAuthChange)

    return () => {
      isMounted = false
      window.removeEventListener('auth-change', handleAuthChange)
    }
  }, [])

  return { user: isReady ? user : getCurrentUser(), isReady }
}
