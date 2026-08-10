import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

function parseDate(dateString) {
  if (!dateString) return null

  if (
    typeof dateString === 'string' &&
    /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/.test(dateString) &&
    !/[zZ]|[+-]\d{2}:?\d{2}$/.test(dateString)
  ) {
    const normalized = dateString.replace(' ', 'T')
    const utcDate = new Date(`${normalized.endsWith('Z') ? normalized : `${normalized}Z`}`)
    if (!Number.isNaN(utcDate.getTime())) return utcDate
  }

  const date = new Date(dateString)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatPostDate(dateString) {
  const date = parseDate(dateString)
  if (!date) return ''

  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatCommentDate(dateString) {
  const date = parseDate(dateString)
  if (!date) return ''

  const datePart = date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const timePart = date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  })

  return `${datePart} at ${timePart}`
}

export function formatRelativeTime(dateString) {
  const date = parseDate(dateString)
  if (!date) return ''

  const diffMs = Date.now() - date.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)

  if (diffMinutes < 1) return 'Just now'
  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`
  }

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
  }

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`
  }

  return formatPostDate(dateString)
}
