import { useEffect, useState } from 'react'
import './CategoryBurst.css'

const BUBBLES = [
  { x: -20, y: -24, delay: 0 },
  { x: 16, y: -32, delay: 50 },
  { x: -4, y: -40, delay: 100 },
  { x: 24, y: -14, delay: 80 },
  { x: -26, y: -6, delay: 30 },
]

function CategoryBurst({ icon: Icon, color }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 700)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <span className="category-burst" aria-hidden="true">
      {BUBBLES.map((bubble, index) => (
        <span
          key={index}
          className="category-burst-bubble"
          style={{
            '--bx': `${bubble.x}px`,
            '--by': `${bubble.y}px`,
            animationDelay: `${bubble.delay}ms`,
            background: color,
          }}
        >
          <Icon size={11} strokeWidth={2.5} color="#ffffff" />
        </span>
      ))}
    </span>
  )
}

export default CategoryBurst
