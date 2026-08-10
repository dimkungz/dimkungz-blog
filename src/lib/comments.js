import { API_BASE_URL, getAuthHeaders, parseApiResponse } from './api'

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
  const data = await parseApiResponse(response)
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

  const data = await parseApiResponse(response)
  return normalizeComment(data.data)
}
