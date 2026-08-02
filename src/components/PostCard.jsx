import { Link } from 'react-router-dom'
import { Heart, MapPin, Compass } from 'lucide-react'
import { getCategory } from '../constants/categories'
import './PostCard.css'

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function PostCard({ post }) {
  const category = getCategory(post.category)
  const CategoryIcon = category?.icon ?? Compass
  const categoryColor = category?.color ?? 'var(--color-primary)'

  return (
    <Link to={`/posts/${post.id}`} className="post-card" style={{ '--tape-color': categoryColor }}>
      <span className="post-card-tape" aria-hidden="true" />

      <div className="post-card-icon" style={{ borderColor: categoryColor, color: categoryColor }}>
        <CategoryIcon size={20} strokeWidth={2} />
      </div>

      {post.location && (
        <span className="post-card-badge">
          <MapPin size={13} strokeWidth={2} />
          {post.location}
        </span>
      )}

      <h3 className="post-card-title">{post.title}</h3>

      <div className="post-card-meta">
        <span className="post-card-upvotes">
          <Heart size={15} strokeWidth={2} />
          {post.upvotes}
        </span>
        <span className="post-card-dot">·</span>
        <span>{formatDate(post.created_at)}</span>
      </div>
    </Link>
  )
}

export default PostCard
