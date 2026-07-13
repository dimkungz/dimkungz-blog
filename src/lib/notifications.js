const NOTIFICATIONS_KEY = 'notifications'

const DEFAULT_NOTIFICATIONS = [
  {
    id: '1',
    title: 'New comment on your article',
    message: 'Someone replied to "The Art of Mindful Living".',
    time: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    title: 'Your post got a new like',
    message: '"Cat Care Tips" received 5 new likes.',
    time: '5 hours ago',
    read: false,
  },
  {
    id: '3',
    title: 'Welcome to hh.',
    message: 'Thanks for joining our community!',
    time: '1 day ago',
    read: true,
  },
]

export function getNotifications() {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY)
    if (!raw) {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(DEFAULT_NOTIFICATIONS))
      return DEFAULT_NOTIFICATIONS
    }
    return JSON.parse(raw)
  } catch {
    return DEFAULT_NOTIFICATIONS
  }
}

export function saveNotifications(notifications) {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications))
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
