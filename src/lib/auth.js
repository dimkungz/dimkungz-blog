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
    })
  )
  window.dispatchEvent(new Event('auth-change'))
}

export function logout() {
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem(CURRENT_USER_KEY)
  window.dispatchEvent(new Event('auth-change'))
}

export const DEFAULT_AVATAR =
  'https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg'
