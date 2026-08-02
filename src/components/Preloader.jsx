import { useEffect, useState } from 'react'
import { Compass } from 'lucide-react'
import SplitIcon from './SplitIcon'
import './Preloader.css'

const BUBBLES = [
  { color: '#E8447C', size: 22, top: '18%', left: '30%', delay: 0 },
  { color: '#5B8C68', size: 16, top: '70%', left: '26%', delay: 120 },
  { color: '#4E89AE', size: 28, top: '22%', left: '70%', delay: 200 },
  { color: '#D4A527', size: 14, top: '76%', left: '68%', delay: 320 },
  { color: '#8A6FB0', size: 18, top: '48%', left: '84%', delay: 80 },
]

function Preloader() {
  const [fading, setFading] = useState(false)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 1400)
    const removeTimer = setTimeout(() => setVisible(false), 1800)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(removeTimer)
    }
  }, [])

  if (!visible) return null

  return (
    <div className={`preloader ${fading ? 'preloader-exit' : ''}`}>
      <div className="preloader-mark">
        {BUBBLES.map((bubble, index) => (
          <span
            key={index}
            className="preloader-bubble"
            style={{
              background: bubble.color,
              width: bubble.size,
              height: bubble.size,
              top: bubble.top,
              left: bubble.left,
              animationDelay: `${bubble.delay}ms`,
            }}
          />
        ))}

        <div className="preloader-logo">
          <SplitIcon icon={Compass} size={32} />
          <span>Off the Map</span>
        </div>
      </div>
    </div>
  )
}

export default Preloader
