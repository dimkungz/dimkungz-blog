const ADMIN_SESSION_KEY = 'isAdminLoggedIn'
const ADMIN_PROFILE_KEY = 'adminProfile'
const ADMIN_PASSWORD_KEY = 'adminPassword'

const ADMIN_CREDENTIALS = {
  email: 'admin@hh.com',
  password: 'admin123',
}

const DEFAULT_ADMIN_PROFILE = {
  name: 'Thompson P.',
  username: 'thompson',
  email: ADMIN_CREDENTIALS.email,
  bio: 'I am a pet enthusiast and freelance writer who specializes in animal behavior and care. With a deep love for cats.',
  avatar: null,
}

export function isAdminLoggedIn() {
  return localStorage.getItem(ADMIN_SESSION_KEY) === 'true'
}

export function getAdminEmail() {
  return ADMIN_CREDENTIALS.email
}

function getAdminPassword() {
  return localStorage.getItem(ADMIN_PASSWORD_KEY) || ADMIN_CREDENTIALS.password
}

export function adminLogin(email, password) {
  const normalizedEmail = email.trim().toLowerCase()

  if (normalizedEmail !== ADMIN_CREDENTIALS.email || password !== getAdminPassword()) {
    return false
  }

  localStorage.setItem(ADMIN_SESSION_KEY, 'true')
  window.dispatchEvent(new Event('admin-auth-change'))
  return true
}

export function adminLogout() {
  localStorage.removeItem(ADMIN_SESSION_KEY)
  window.dispatchEvent(new Event('admin-auth-change'))
}

export function getAdminProfile() {
  try {
    const raw = localStorage.getItem(ADMIN_PROFILE_KEY)
    if (!raw) return { ...DEFAULT_ADMIN_PROFILE }

    return { ...DEFAULT_ADMIN_PROFILE, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT_ADMIN_PROFILE }
  }
}

export function updateAdminProfile(updates) {
  const profile = getAdminProfile()
  const nextProfile = { ...profile, ...updates }

  localStorage.setItem(ADMIN_PROFILE_KEY, JSON.stringify(nextProfile))
  window.dispatchEvent(new Event('admin-profile-change'))
  return nextProfile
}

export function updateAdminPassword(currentPassword, newPassword) {
  if (currentPassword !== getAdminPassword()) {
    return { ok: false }
  }

  localStorage.setItem(ADMIN_PASSWORD_KEY, newPassword)
  return { ok: true }
}
