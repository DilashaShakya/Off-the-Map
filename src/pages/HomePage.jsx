import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Compass } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { CATEGORIES } from '../constants/categories'
import PostCard from '../components/PostCard'
import ScrollTrail from '../components/ScrollTrail'
import CategoryBurst from '../components/CategoryBurst'
import './HomePage.css'

function HomePage() {
  const gridRef = useRef(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [sortBy, setSortBy] = useState('newest')
  const [burstLabel, setBurstLabel] = useState(null)
  const [burstKey, setBurstKey] = useState(0)

  useEffect(() => {
    async function fetchPosts() {
      const { data, error: fetchError } = await supabase
        .from('posts')
        .select('*')

      if (fetchError) {
        setError(fetchError.message)
      } else {
        setPosts(data)
      }
      setLoading(false)
    }

    fetchPosts()
  }, [])

  const visiblePosts = useMemo(() => {
    let result = posts

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase()
      result = result.filter((post) => post.title.toLowerCase().includes(term))
    }

    if (selectedCategory) {
      result = result.filter((post) => post.category === selectedCategory)
    }

    return [...result].sort((a, b) =>
      sortBy === 'upvotes'
        ? b.upvotes - a.upvotes
        : new Date(b.created_at) - new Date(a.created_at)
    )
  }, [posts, searchTerm, selectedCategory, sortBy])

  return (
    <div className="home-page">
      <div className="hero-wrapper">
        <section className="hero">
          <h1>Off the Map</h1>
          <p className="hero-tagline">Discover places worth exploring.</p>

          <div className="hero-search">
            <Search size={18} strokeWidth={2} />
            <input
              type="text"
              placeholder="Search places..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="category-chips">
            {CATEGORIES.map(({ label, icon: Icon, color }) => (
              <button
                key={label}
                type="button"
                className={`category-chip ${selectedCategory === label ? 'active' : ''}`}
                style={{ '--chip-color': color }}
                onClick={() => {
                  const turningOn = selectedCategory !== label
                  setSelectedCategory(turningOn ? label : null)
                  if (turningOn) {
                    setBurstLabel(label)
                    setBurstKey((key) => key + 1)
                  }
                }}
              >
                <Icon size={15} strokeWidth={2} />
                {label}
                {burstLabel === label && burstKey > 0 && (
                  <CategoryBurst key={burstKey} icon={Icon} color={color} />
                )}
              </button>
            ))}
          </div>
        </section>
      </div>

      <section className="feed">
        <div className="feed-header">
          <h2>Recently shared</h2>
          <div className="sort-toggle">
            <button
              type="button"
              className={sortBy === 'newest' ? 'active' : ''}
              onClick={() => setSortBy('newest')}
            >
              Newest
            </button>
            <button
              type="button"
              className={sortBy === 'upvotes' ? 'active' : ''}
              onClick={() => setSortBy('upvotes')}
            >
              Most upvoted
            </button>
          </div>
        </div>

        {loading && <p className="feed-status">Loading hidden gems…</p>}
        {error && <p className="feed-status feed-error">{error}</p>}

        {!loading && !error && visiblePosts.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Compass size={32} strokeWidth={1.75} />
            </div>
            <p>No hidden gems yet.</p>
            <p>Be the first explorer to share one.</p>
            <Link to="/create" className="btn-primary">
              Share a hidden gem
            </Link>
          </div>
        )}

        <div className="feed-body">
          <div className="feed-trail">
            <ScrollTrail targetRef={gridRef} />
          </div>

          <div className="post-grid" ref={gridRef}>
            {visiblePosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
