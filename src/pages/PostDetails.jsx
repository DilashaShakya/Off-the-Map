import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Heart, MapPin, Tag, Pencil, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { isPostLiked, setPostLiked } from '../lib/likedPosts'
import CelebrationToast from '../components/CelebrationToast'
import './PostDetails.css'

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function PostDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [upvoting, setUpvoting] = useState(false)
  const [liked, setLiked] = useState(false)
  const [celebrateKey, setCelebrateKey] = useState(0)

  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)

  useEffect(() => {
    async function fetchPost() {
      const { data, error: fetchError } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) {
        setError(fetchError.message)
      } else {
        setPost(data)
        setLiked(isPostLiked(id))
      }
      setLoading(false)
    }

    async function fetchComments() {
      const { data } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', id)
        .order('created_at', { ascending: true })

      setComments(data ?? [])
    }

    fetchPost()
    fetchComments()
  }, [id])

  const handleToggleUpvote = async () => {
    setUpvoting(true)
    const nextLiked = !liked
    const rpcName = nextLiked ? 'increment_upvote' : 'decrement_upvote'
    const { error: rpcError } = await supabase.rpc(rpcName, { post_id: id })

    if (!rpcError) {
      setPost((current) => ({
        ...current,
        upvotes: nextLiked ? current.upvotes + 1 : Math.max(current.upvotes - 1, 0),
      }))
      setPostLiked(id, nextLiked)
      setLiked(nextLiked)
      if (nextLiked) setCelebrateKey((key) => key + 1)
    }
    setUpvoting(false)
  }

  const handleDelete = async () => {
    const confirmed = window.confirm('Delete this hidden gem? This can\'t be undone.')
    if (!confirmed) return

    const { error: deleteError } = await supabase.from('posts').delete().eq('id', id)
    if (!deleteError) {
      navigate('/')
    }
  }

  const handleAddComment = async (event) => {
    event.preventDefault()
    if (!commentText.trim()) return

    setSubmittingComment(true)
    const { data, error: commentError } = await supabase
      .from('comments')
      .insert({ post_id: id, content: commentText.trim() })
      .select()
      .single()
    setSubmittingComment(false)

    if (!commentError) {
      setComments((current) => [...current, data])
      setCommentText('')
      setCelebrateKey((key) => key + 1)
    }
  }

  if (loading) return <p className="detail-status">Loading…</p>
  if (error) return <p className="detail-status detail-error">{error}</p>
  if (!post) return null

  return (
    <div className="post-detail">
      {post.image_url && (
        <div className="post-detail-hero">
          <img src={post.image_url} alt={post.title} />
        </div>
      )}

      <div className="post-detail-body">
        {celebrateKey > 0 && <CelebrationToast key={celebrateKey} />}

        <div className="post-detail-badges">
          {post.location && (
            <span className="post-detail-badge">
              <MapPin size={14} strokeWidth={2} />
              {post.location}
            </span>
          )}
          {post.category && (
            <span className="post-detail-badge">
              <Tag size={14} strokeWidth={2} />
              {post.category}
            </span>
          )}
        </div>

        <h1>{post.title}</h1>

        <div className="post-detail-meta">
          <span>{formatDate(post.created_at)}</span>
          <div className="post-detail-owner-actions">
            <Link to={`/posts/${post.id}/edit`} className="btn-secondary">
              <Pencil size={15} strokeWidth={2} />
              Edit
            </Link>
            <button type="button" className="btn-secondary" onClick={handleDelete}>
              <Trash2 size={15} strokeWidth={2} />
              Delete
            </button>
          </div>
        </div>

        <button
          type="button"
          className={`upvote-button ${liked ? 'liked' : ''}`}
          onClick={handleToggleUpvote}
          disabled={upvoting}
          aria-pressed={liked}
        >
          <Heart size={18} strokeWidth={2} fill={liked ? 'currentColor' : 'none'} />
          {post.upvotes} {liked ? 'liked' : 'upvotes'}
        </button>

        {post.story && (
          <div className="post-detail-story">
            <h2>Story</h2>
            <p>{post.story}</p>
          </div>
        )}

        <div className="post-detail-comments">
          <h2>Comments</h2>

          {comments.length === 0 && <p className="comments-empty">No comments yet.</p>}

          <ul className="comments-list">
            {comments.map((comment) => (
              <li key={comment.id} className="comment">
                <p>{comment.content}</p>
                <span>{formatDate(comment.created_at)}</span>
              </li>
            ))}
          </ul>

          <form className="comment-form" onSubmit={handleAddComment}>
            <textarea
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              placeholder="Add to the discussion..."
              rows={3}
            />
            <button type="submit" className="btn-primary" disabled={submittingComment}>
              {submittingComment ? 'Posting…' : 'Post comment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PostDetails
