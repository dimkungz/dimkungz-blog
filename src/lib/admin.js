import { getToken } from './api'
import {
  getCurrentUser,
  isLoggedIn,
  loginWithApi,
  logout,
  resetPasswordWithApi,
} from './auth'

const ADMIN_PROFILE_KEY = 'adminProfile'

const DEFAULT_ADMIN_PROFILE = {
  bio: 'I am a pet enthusiast and freelance writer who specializes in animal behavior and care. With a deep love for cats.',
}

export function isAdminLoggedIn() {
  const user = getCurrentUser()
  return isLoggedIn() && user?.role === 'admin'
}

export function getAdminEmail() {
  return getCurrentUser()?.email ?? ''
}

export async function adminLogin(email, password) {
  try {
    const user = await loginWithApi(email, password)

    if (user.role !== 'admin') {
      logout()
      return false
    }

    window.dispatchEvent(new Event('admin-auth-change'))
    return true
  } catch {
    return false
  }
}

export function adminLogout() {
  logout()
  window.dispatchEvent(new Event('admin-auth-change'))
}

export function getAdminProfile() {
  const user = getCurrentUser()
  const stored = (() => {
    try {
      const raw = localStorage.getItem(ADMIN_PROFILE_KEY)
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  })()

  return {
    name: user?.name ?? stored.name ?? 'Admin',
    username: user?.username ?? stored.username ?? 'admin',
    email: user?.email ?? stored.email ?? '',
    avatar: user?.avatar ?? stored.avatar ?? null,
    bio: stored.bio ?? DEFAULT_ADMIN_PROFILE.bio,
  }
}

export function updateAdminProfile(updates) {
  const stored = (() => {
    try {
      const raw = localStorage.getItem(ADMIN_PROFILE_KEY)
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  })()

  const nextProfile = {
    ...stored,
    ...(updates.bio !== undefined ? { bio: updates.bio } : {}),
  }

  localStorage.setItem(ADMIN_PROFILE_KEY, JSON.stringify(nextProfile))
  window.dispatchEvent(new Event('admin-profile-change'))
  return getAdminProfile()
}

export async function updateAdminPassword(currentPassword, newPassword) {
  try {
    await resetPasswordWithApi(currentPassword, newPassword)
    return { ok: true }
  } catch {
    return { ok: false }
  }
}

export function getAdminToken() {
  return getToken()
}
