import { API_BASE_URL, getAuthHeaders, parseApiResponse } from './api'

const DEFAULT_AUTHOR = 'Thompson P.'
const PAGE_SIZE = 6

export { API_BASE_URL }

export function getValidPostId(postId) {
  const id = Number(postId)

  if (!Number.isInteger(id) || id < 1) {
    return null
  }

  return id
}

export function normalizePost(post) {
  return {
    id: post.id,
    title: post.title,
    image: post.image,
    category: post.category,
    description: post.description,
    content: post.content,
    status: post.status,
    author: post.author ?? DEFAULT_AUTHOR,
    authorAvatar: post.author_avatar ?? post.authorAvatar ?? null,
    date: post.date ?? post.created_at ?? null,
    likes: post.likes ?? 0,
  }
}

export function isPublishedPost(post) {
  return post.status?.toLowerCase() === 'publish'
}

export function isDraftPost(post) {
  return post.status?.toLowerCase() === 'draft'
}

export async function fetchPostsPage(page = 1, filters = {}) {
  const params = new URLSearchParams({ page: String(page) })

  if (filters.title) params.set('title', filters.title)
  if (filters.category) params.set('category', filters.category)

  const response = await fetch(`${API_BASE_URL}/posts?${params}`)

  const data = await parseApiResponse(response)
  return (data.data ?? []).map(normalizePost)
}

export async function fetchPosts(options = {}) {
  if (options.page) {
    return fetchPostsPage(options.page, options)
  }

  const allPosts = []
  let page = 1

  while (true) {
    const batch = await fetchPostsPage(page, options)
    if (batch.length === 0) break

    allPosts.push(...batch)

    if (batch.length < PAGE_SIZE) break
    page += 1
  }

  return allPosts
}

export async function fetchPublishedPosts() {
  const posts = await fetchPosts()
  return posts.filter(isPublishedPost)
}

export async function fetchPost(postId) {
  const validPostId = getValidPostId(postId)
  if (validPostId === null) {
    throw new Error('Invalid post id')
  }

  const response = await fetch(`${API_BASE_URL}/posts/${validPostId}`)

  const data = await parseApiResponse(response)
  return normalizePost(data.data)
}

export async function createPost(formData) {
  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  })

  return parseApiResponse(response)
}

export async function updatePost(postId, formData) {
  const validPostId = getValidPostId(postId)
  if (validPostId === null) {
    throw new Error('Invalid post id')
  }

  const response = await fetch(`${API_BASE_URL}/posts/${validPostId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: formData,
  })

  return parseApiResponse(response)
}

export async function deletePost(postId) {
  const validPostId = getValidPostId(postId)
  if (validPostId === null) {
    throw new Error('Invalid post id')
  }

  const response = await fetch(`${API_BASE_URL}/posts/${validPostId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })

  return parseApiResponse(response)
}
