export const API_BASE_URL = 'https://blog-post-project-api.vercel.app'

export function getValidPostId(postId) {
  const id = Number(postId)

  if (!Number.isInteger(id) || id < 1) {
    return null
  }

  return id
}

export async function fetchPosts(limit = 30) {
  const response = await fetch(`${API_BASE_URL}/posts?limit=${limit}`)

  if (!response.ok) {
    throw new Error('Failed to fetch posts')
  }

  const data = await response.json()
  return data.posts
}

export async function fetchPost(postId) {
  const validPostId = getValidPostId(postId)
  if (validPostId === null) {
    throw new Error('Invalid post id')
  }

  const response = await fetch(`${API_BASE_URL}/posts/${validPostId}`)

  if (!response.ok) {
    throw new Error('Failed to fetch post')
  }

  return response.json()
}
