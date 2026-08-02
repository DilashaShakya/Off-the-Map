import { useEffect, useId, useMemo, useRef, useState } from 'react'
import './ScrollTrail.css'

const WAVE_LENGTH = 70

function buildWavyPath(width, height) {
  const midX = width / 2
  const amplitude = width / 2 - 6
  let d = `M ${midX} 0`
  let y = 0
  let goRight = true

  while (y < height) {
    const nextY = Math.min(y + WAVE_LENGTH, height)
    const cpY = (y + nextY) / 2
    const targetX = goRight ? midX + amplitude : midX - amplitude
    d += ` C ${midX} ${cpY}, ${targetX} ${cpY}, ${midX} ${nextY}`
    y = nextY
    goRight = !goRight
  }

  return d
}

function ScrollTrail({ targetRef }) {
  const gradientId = useId()
  const pathRef = useRef(null)
  const markerRingRef = useRef(null)
  const markerDotRef = useRef(null)
  const pathLengthRef = useRef(0)
  const displayedProgressRef = useRef(0)

  const [size, setSize] = useState({ width: 48, height: 0 })

  useEffect(() => {
    const el = targetRef.current
    if (!el) return

    const observer = new ResizeObserver((entries) => {
      const height = entries[0].contentRect.height
      setSize((current) => ({ ...current, height }))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [targetRef])

  const pathD = useMemo(
    () => (size.height < 10 ? '' : buildWavyPath(size.width, size.height)),
    [size]
  )

  useEffect(() => {
    if (!pathRef.current) return
    pathLengthRef.current = pathRef.current.getTotalLength()
    pathRef.current.style.strokeDasharray = pathLengthRef.current
    pathRef.current.style.strokeDashoffset = pathLengthRef.current
  }, [pathD])

  useEffect(() => {
    let rafId

    function tick() {
      const el = targetRef.current
      const path = pathRef.current
      const ring = markerRingRef.current
      const dot = markerDotRef.current

      if (el && path && ring && dot) {
        const rect = el.getBoundingClientRect()
        const viewportHeight = window.innerHeight
        // 0 at the very top of the page, 1 once the grid's bottom has
        // scrolled up to the bottom of the screen — so it starts moving
        // as soon as you start scrolling at all, not only once the grid
        // itself reaches the viewport.
        const gridDocTop = rect.top + window.scrollY
        const endScrollY = Math.max(gridDocTop + rect.height - viewportHeight, 1)
        const target = Math.min(1, Math.max(0, window.scrollY / endScrollY))

        // Ease toward the target instead of snapping to it every frame —
        // makes the trail lag behind the scroll a little, like it's
        // catching up, rather than moving at exactly scroll speed.
        const eased = displayedProgressRef.current + (target - displayedProgressRef.current) * 0.06
        displayedProgressRef.current = Math.abs(target - eased) < 0.0005 ? target : eased
        const progress = displayedProgressRef.current

        const length = pathLengthRef.current
        path.style.strokeDashoffset = length * (1 - progress)

        if (length > 0) {
          const point = path.getPointAtLength(length * progress)
          ring.setAttribute('cx', point.x)
          ring.setAttribute('cy', point.y)
          dot.setAttribute('cx', point.x)
          dot.setAttribute('cy', point.y)
          const opacity = progress > 0.01 ? 1 : 0
          ring.style.opacity = opacity
          dot.style.opacity = opacity

          // Marker matches whichever half of the green/pink split it's crossing
          const markerColor = progress < 0.5 ? 'var(--color-green)' : 'var(--color-primary)'
          ring.style.stroke = markerColor
          dot.style.fill = markerColor
        }
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [targetRef, pathD])

  if (!pathD) return null

  return (
    <svg
      className="scroll-trail"
      width={size.width}
      height={size.height}
      viewBox={`0 0 ${size.width} ${size.height}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-green)" />
          <stop offset="50%" stopColor="var(--color-green)" />
          <stop offset="50%" stopColor="var(--color-primary)" />
          <stop offset="100%" stopColor="var(--color-primary)" />
        </linearGradient>
      </defs>
      <path d={pathD} className="scroll-trail-path-base" />
      <path
        ref={pathRef}
        d={pathD}
        className="scroll-trail-path-progress"
        stroke={`url(#${gradientId})`}
      />
      <circle ref={markerRingRef} r="7" className="scroll-trail-marker-ring" cx={size.width / 2} cy="0" />
      <circle ref={markerDotRef} r="3" className="scroll-trail-marker-dot" cx={size.width / 2} cy="0" />
    </svg>
  )
}

export default ScrollTrail
