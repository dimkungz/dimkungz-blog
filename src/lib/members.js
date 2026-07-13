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

export function getMemberByEmail(email) {
  const normalized = email.trim().toLowerCase()
  return (
    getMembers().find((member) => member.email.toLowerCase() === normalized) ?? null
  )
}

export function isUsernameTakenByOther(username, email) {
  const normalizedUsername = username.trim().toLowerCase()
  const normalizedEmail = email.trim().toLowerCase()

  return getMembers().some(
    (member) =>
      member.username.toLowerCase() === normalizedUsername &&
      member.email.toLowerCase() !== normalizedEmail
  )
}

export function updateMemberProfile(email, { name, username, avatar }) {
  const members = getMembers()
  const normalizedEmail = email.trim().toLowerCase()
  const index = members.findIndex(
    (member) => member.email.toLowerCase() === normalizedEmail
  )

  if (index === -1) return false

  members[index] = {
    ...members[index],
    name: name.trim(),
    username: username.trim(),
    ...(avatar !== undefined ? { avatar } : {}),
  }

  saveMembers(members)
  return true
}

export function updateMemberPassword(email, currentPassword, newPassword) {
  const members = getMembers()
  const normalizedEmail = email.trim().toLowerCase()
  const index = members.findIndex(
    (member) => member.email.toLowerCase() === normalizedEmail
  )

  if (index === -1) return { ok: false, error: 'member-not-found' }

  if (members[index].password !== currentPassword) {
    return { ok: false, error: 'wrong-password' }
  }

  members[index] = {
    ...members[index],
    password: newPassword,
  }

  saveMembers(members)
  return { ok: true }
}
