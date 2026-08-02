import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { CATEGORY_LABELS } from '../constants/categories'
import './CreatePostPage.css'

function CreatePostPage() {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState(CATEGORY_LABELS[0])
  const [imageUrl, setImageUrl] = useState('')
  const [story, setStory] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)

    if (!title.trim()) {
      setError('Give your hidden gem a name.')
      return
    }

    setSubmitting(true)

    const { data, error: insertError } = await supabase
      .from('posts')
      .insert({
        title: title.trim(),
        location: location.trim() || null,
        category,
        image_url: imageUrl.trim() || null,
        story: story.trim() || null,
      })
      .select()
      .single()

    setSubmitting(false)

    if (insertError) {
      setError(insertError.message)
      return
    }

    navigate(`/posts/${data.id}`)
  }

  return (
    <div className="create-page">
      <form className="create-form" onSubmit={handleSubmit}>
        <h1>Share a Hidden Gem</h1>
        <p className="create-subtitle">Tell fellow explorers about a place worth finding.</p>

        <label className="form-field">
          Place Name
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. The Bamboo Grove Tea House"
            required
          />
        </label>

        <label className="form-field">
          Location
          <input
            type="text"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="e.g. Kyoto, Japan"
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
            placeholder="https://..."
          />
        </label>

        <label className="form-field">
          Story
          <span className="form-field-prompt">What makes this place worth exploring?</span>
          <textarea
            value={story}
            onChange={(event) => setStory(event.target.value)}
            rows={6}
            placeholder="Tell the story..."
          />
        </label>

        {error && <p className="create-error">{error}</p>}

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Sharing…' : 'Share this place'}
        </button>
      </form>
    </div>
  )
}

export default CreatePostPage
