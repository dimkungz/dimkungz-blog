const UNIQUE_POST_COUNT = 6

export function getValidPostId(postId) {
  const id = Number(postId)

  if (!Number.isInteger(id) || id < 1 || id > UNIQUE_POST_COUNT) {
    return null
  }

  return id
}

export function deduplicatePosts(posts) {
  const seenTitles = new Set()

  return posts.filter((post) => {
    if (seenTitles.has(post.title)) return false
    seenTitles.add(post.title)
    return true
  })
}
