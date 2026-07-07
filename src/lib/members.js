const MEMBERS_KEY = 'members'

export function getMembers() {
  try {
    const raw = localStorage.getItem(MEMBERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveMembers(members) {
  localStorage.setItem(MEMBERS_KEY, JSON.stringify(members))
}

export function isUsernameTaken(username) {
  const normalized = username.trim().toLowerCase()
  return getMembers().some((member) => member.username.toLowerCase() === normalized)
}

export function isEmailTaken(email) {
  const normalized = email.trim().toLowerCase()
  return getMembers().some((member) => member.email.toLowerCase() === normalized)
}

export function registerMember({ name, username, email, password }) {
  const members = getMembers()

  members.push({
    name: name.trim(),
    username: username.trim(),
    email: email.trim().toLowerCase(),
    password,
  })

  saveMembers(members)
}

export function authenticateMember(email, password) {
  const normalized = email.trim().toLowerCase()
  return (
    getMembers().find(
      (member) =>
        member.email.toLowerCase() === normalized && member.password === password
    ) ?? null
  )
}
