const ADMIN_NOTIFICATIONS_KEY = 'adminNotifications'

const DEFAULT_ADMIN_NOTIFICATIONS = [
  {
    id: '1',
    type: 'comment',
    userName: 'Jacob Lash',
    userAvatar: null,
    articleTitle: 'The Fascinating World of Cats: Why We Love Our Furry Friends',
    articleId: 2,
    comment:
      'I loved this article! It really explains why my cat is so independent yet loving. The purring section was super interesting.',
    time: '4 hours ago',
    read: false,
  },
  {
    id: '2',
    type: 'like',
    userName: 'Jacob Lash',
    userAvatar: null,
    articleTitle: 'The Fascinating World of Cats: Why We Love Our Furry Friends',
    articleId: 2,
    comment: null,
    time: '4 hours ago',
    read: false,
  },
]

export function getNotificationActionText(notification) {
  return notification.type === 'comment'
    ? 'Commented on your article:'
    : 'liked your article:'
}

export function getNotificationSummary(notification) {
  return {
    title: `${notification.userName} ${getNotificationActionText(notification)}`,
    message: notification.articleTitle,
  }
}

export function initializeAdminNotifications() {
  localStorage.setItem(
    ADMIN_NOTIFICATIONS_KEY,
    JSON.stringify(DEFAULT_ADMIN_NOTIFICATIONS)
  )
  window.dispatchEvent(new Event('notifications-change'))
}

export function clearAdminNotifications() {
  localStorage.removeItem(ADMIN_NOTIFICATIONS_KEY)
  window.dispatchEvent(new Event('notifications-change'))
}

export function getNotifications() {
  try {
    const raw = localStorage.getItem(ADMIN_NOTIFICATIONS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveNotifications(notifications) {
  localStorage.setItem(ADMIN_NOTIFICATIONS_KEY, JSON.stringify(notifications))
  window.dispatchEvent(new Event('notifications-change'))
}

export function getUnreadCount() {
  return getNotifications().filter((notification) => !notification.read).length
}

export function markAllNotificationsRead() {
  const notifications = getNotifications().map((notification) => ({
    ...notification,
    read: true,
  }))
  saveNotifications(notifications)
}

export function markNotificationRead(id) {
  const notifications = getNotifications().map((notification) =>
    notification.id === id ? { ...notification, read: true } : notification
  )
  saveNotifications(notifications)
}
