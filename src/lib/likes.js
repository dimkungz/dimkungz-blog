import { API_BASE_URL, getAuthHeaders, parseApiResponse } from './api'

export async function fetchPostLikes(postId) {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/likes`, {
    headers: getAuthHeaders(),
  })

  const data = await parseApiResponse(response)

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

  const data = await parseApiResponse(response)

  return {
    count: data.data?.count ?? 0,
    liked: Boolean(data.data?.liked),
  }
}
