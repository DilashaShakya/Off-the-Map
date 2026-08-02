import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { CATEGORY_LABELS } from '../constants/categories'
import './CreatePostPage.css'

function EditPostPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState(CATEGORY_LABELS[0])
  const [imageUrl, setImageUrl] = useState('')
  const [story, setStory] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function fetchPost() {
      const { data, error: fetchError } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError || !data) {
        setNotFound(true)
      } else {
        setTitle(data.title)
        setLocation(data.location ?? '')
        setCategory(data.category ?? CATEGORY_LABELS[0])
        setImageUrl(data.image_url ?? '')
        setStory(data.story ?? '')
      }
      setLoading(false)
    }

    fetchPost()
  }, [id])

  if (loading) return <p className="detail-status">Loading…</p>
  if (notFound) return <p className="detail-status">Post not found.</p>

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)

    if (!title.trim()) {
      setError('Give your hidden gem a name.')
      return
    }

    setSubmitting(true)

    const { error: updateError } = await supabase
      .from('posts')
      .update({
        title: title.trim(),
        location: location.trim() || null,
        category,
        image_url: imageUrl.trim() || null,
        story: story.trim() || null,
      })
      .eq('id', id)

    setSubmitting(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    navigate(`/posts/${id}`)
  }

  return (
    <div className="create-page">
      <form className="create-form" onSubmit={handleSubmit}>
        <h1>Edit Hidden Gem</h1>

        <label className="form-field">
          Place Name
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </label>

        <label className="form-field">
          Location
          <input
            type="text"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          />
        </label>

        <label className="form-field">
          Category
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            {CATEGORY_LABELS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="form-field">
          Image URL
          <input
            type="url"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
          />
        </label>

        <label className="form-field">
          Story
          <span className="form-field-prompt">What makes this place worth exploring?</span>
          <textarea
            value={story}
            onChange={(event) => setStory(event.target.value)}
            rows={6}
          />
        </label>

        {error && <p className="create-error">{error}</p>}

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  )
}

export default EditPostPage
