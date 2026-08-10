import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminLayout } from '@/components/AdminLayout'
import { DEFAULT_AVATAR } from '@/lib/auth'
import {
  fetchNotifications,
  getNotificationActionText,
  markNotificationRead,
} from '@/lib/notifications'

function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const loadNotifications = useCallback(async () => {
    setIsLoading(true)

    try {
      const data = await fetchNotifications()
      setNotifications(data)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
      setNotifications([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadNotifications()

    window.addEventListener('notifications-change', loadNotifications)
    window.addEventListener('admin-auth-change', loadNotifications)

    return () => {
      window.removeEventListener('notifications-change', loadNotifications)
      window.removeEventListener('admin-auth-change', loadNotifications)
    }
  }, [loadNotifications])

  const handleView = async (notification) => {
    try {
      await markNotificationRead(notification.id)
      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id ? { ...item, read: true } : item
        )
      )
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  return (
    <AdminLayout activePage="notifications">
      <div className="mb-6 border-b border-stone-200 pb-6 sm:mb-8">
        <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">Notification</h1>
      </div>

      {isLoading ? (
        <p className="text-sm text-stone-500">Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p className="text-sm text-stone-500">No notifications yet</p>
      ) : (
        <ul className="divide-y divide-stone-200">
          {notifications.map((notification) => {
            const avatar = notification.userAvatar || DEFAULT_AVATAR
            const viewLink = notification.articleId
              ? `/post/${notification.articleId}`
              : '/admin/articles'

            return (
              <li key={notification.id} className="py-6 first:pt-0">
                <div className="flex gap-4">
                  <img
                    src={avatar}
                    alt={notification.userName}
                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-sm leading-relaxed text-stone-700">
                        <span className="font-semibold text-stone-900">
                          {notification.userName}
                        </span>{' '}
                        {getNotificationActionText(notification)}{' '}
                        {notification.articleTitle}
                      </p>

                      <Link
                        to={viewLink}
                        onClick={() => handleView(notification)}
                        className="shrink-0 text-sm text-stone-900 underline underline-offset-2 transition-colors hover:text-stone-600"
                      >
                        View
                      </Link>
                    </div>

                    {notification.comment && (
                      <p className="mt-3 text-sm leading-relaxed text-stone-600">
                        &ldquo;{notification.comment}&rdquo;
                      </p>
                    )}

                    <p className="mt-2 text-sm text-orange-500">{notification.time}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </AdminLayout>
  )
}

export default AdminNotificationsPage
