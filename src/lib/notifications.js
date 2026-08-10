import { API_BASE_URL, getAuthHeaders } from './api'
import { formatRelativeTime } from './utils'

function normalizeNotification(notification) {
  return {
    id: String(notification.id),
    type: notification.type,
    userName: notification.user_name,
    userAvatar: notification.user_avatar ?? null,
    articleTitle: notification.article_title,
    articleId: notification.article_id,
    comment: notification.comment ?? null,
    time: formatRelativeTime(notification.created_at),
    read: Boolean(notification.read),
  }
}

function dispatchNotificationsChange() {
  window.dispatchEvent(new Event('notifications-change'))
}

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

export async function fetchNotifications() {
  const response = await fetch(`${API_BASE_URL}/notifications`, {
    headers: getAuthHeaders(),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Failed to fetch notifications')
  }

  return (data.data ?? []).map(normalizeNotification)
}

export async function markAllNotificationsRead() {
  const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Failed to mark notifications as read')
  }

  dispatchNotificationsChange()
}

export async function markNotificationRead(id) {
  const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Failed to mark notification as read')
  }

  dispatchNotificationsChange()
}
