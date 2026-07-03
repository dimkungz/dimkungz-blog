export function isLoggedIn() {
  return localStorage.getItem('isLoggedIn') === 'true'
}
