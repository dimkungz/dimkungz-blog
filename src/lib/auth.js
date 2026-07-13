import defaultAvatar from '../assets/default-avatar.png'

const CURRENT_USER_KEY = 'currentUser'

export function isLoggedIn() {
  return localStorage.getItem('isLoggedIn') === 'true' && Boolean(getCurrentUser())
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function login(member) {
  localStorage.setItem('isLoggedIn', 'true')
  localStorage.setItem(
    CURRENT_USER_KEY,
    JSON.stringify({
      name: member.name,
      username: member.username,
      email: member.email,
      avatar: member.avatar ?? null,
    })
  )
  window.dispatchEvent(new Event('auth-change'))
}

export function updateCurrentUser(updates) {
  const user = getCurrentUser()
  if (!user) return

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ ...user, ...updates }))
  window.dispatchEvent(new Event('auth-change'))
}

export function logout() {
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem(CURRENT_USER_KEY)
  window.dispatchEvent(new Event('auth-change'))
}

export const DEFAULT_AVATAR = defaultAvatar
