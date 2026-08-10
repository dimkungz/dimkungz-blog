import defaultAvatar from '../assets/default-avatar.png'
import { API_BASE_URL, apiRequest, getAuthHeaders, getToken, setToken } from './api'

const USER_KEY = 'currentUser'

export const DEFAULT_AVATAR = defaultAvatar

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function setCurrentUser(user) {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(USER_KEY)
  }
  window.dispatchEvent(new Event('auth-change'))
}

export function isLoggedIn() {
  return Boolean(getToken() && getCurrentUser())
}

export function updateCurrentUser(updates) {
  const user = getCurrentUser()
  if (!user) return

  setCurrentUser({ ...user, ...updates })
}

export function logout() {
  setToken(null)
  setCurrentUser(null)
}

export async function fetchCurrentUser(token = getToken()) {
  if (!token) return null

  const response = await fetch(`${API_BASE_URL}/auth/get-user`, {
    headers: getAuthHeaders(),
  })

  const data = await parseJsonResponse(response)

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch user')
  }

  return {
    id: data.id,
    email: data.email,
    username: data.username,
    name: data.name,
    role: data.role,
    avatar: data.profilePic || null,
  }
}

async function parseJsonResponse(response) {
  const text = await response.text()
  if (!text) return {}

  try {
    return JSON.parse(text)
  } catch {
    throw new Error(
      response.ok
        ? 'Invalid response from server'
        : `Request failed (${response.status})`
    )
  }
}

export async function loginWithApi(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Login failed')
  }

  setToken(data.access_token)
  const user = await fetchCurrentUser(data.access_token)
  setCurrentUser(user)
  return user
}

export async function registerWithApi({ name, username, email, password }) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, username, email, password }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Registration failed')
  }

  return data
}

export async function resetPasswordWithApi(oldPassword, newPassword) {
  await apiRequest('/auth/reset-password', {
    method: 'PUT',
    body: JSON.stringify({ oldPassword, newPassword }),
  })
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const MAX_IMAGE_SIZE = 5 * 1024 * 1024

export function validateProfileImage(file) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Please upload a valid image file (JPEG, PNG, GIF, WebP).')
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error('Please upload an image smaller than 5MB.')
  }
}

export async function updateProfileWithApi({ name, username, profilePicFile }) {
  if (!API_BASE_URL) {
    throw new Error('API URL is not configured')
  }

  if (!getToken()) {
    throw new Error('Please log in again')
  }

  const formData = new FormData()
  formData.append('name', name)
  formData.append('username', username)
  if (profilePicFile) formData.append('profilePic', profilePicFile)

  const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: formData,
  })

  const data = await parseJsonResponse(response)

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Failed to update profile')
  }

  const user = {
    id: data.id,
    email: data.email,
    username: data.username,
    name: data.name,
    role: data.role,
    avatar: data.profilePic || null,
  }

  setCurrentUser(user)
  return user
}

export async function restoreSession() {
  const token = getToken()
  if (!token) return null

  try {
    const user = await fetchCurrentUser(token)
    setCurrentUser(user)
    return user
  } catch (error) {
    const message = error.message?.toLowerCase() ?? ''
    const isAuthError =
      message.includes('unauthorized') ||
      message.includes('token') ||
      message.includes('log in')

    if (isAuthError) {
      logout()
      return null
    }

    return getCurrentUser()
  }
}

// Backwards-compatible alias used by older pages
export function login(user) {
  setCurrentUser(user)
}
