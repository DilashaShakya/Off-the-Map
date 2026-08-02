const STORAGE_KEY = 'off-the-map-liked-posts'

function readLikedIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

function writeLikedIds(ids) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]))
}

export function isPostLiked(postId) {
  return readLikedIds().has(postId)
}

export function setPostLiked(postId, liked) {
  const ids = readLikedIds()
  if (liked) {
    ids.add(postId)
  } else {
    ids.delete(postId)
  }
  writeLikedIds(ids)
}
