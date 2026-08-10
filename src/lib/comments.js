import { API_BASE_URL, getAuthHeaders } from './api'

export function normalizeComment(comment) {
  return {
    id: comment.id,
    text: comment.comment_text,
    createdAt: comment.created_at,
    author: comment.author ?? 'User',
    authorAvatar: comment.author_avatar ?? null,
  }
}

export async function fetchComments(postId) {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`)

  if (!response.ok) {
    throw new Error('Failed to fetch comments')
  }

  const data = await response.json()
  return (data.data ?? []).map(normalizeComment)
}

export async function createComment(postId, commentText) {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ comment_text: commentText }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.error || data.message || 'Failed to post comment')
  }

  return normalizeComment(data.data)
}
