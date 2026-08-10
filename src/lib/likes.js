import { API_BASE_URL, getAuthHeaders } from './api'

export async function fetchPostLikes(postId) {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/likes`, {
    headers: getAuthHeaders(),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch likes')
  }

  return {
    count: data.data?.count ?? 0,
    liked: Boolean(data.data?.liked),
  }
}

export async function togglePostLike(postId) {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/likes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Failed to update like')
  }

  return {
    count: data.data?.count ?? 0,
    liked: Boolean(data.data?.liked),
  }
}
