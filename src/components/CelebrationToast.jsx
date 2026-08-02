import { useEffect, useState } from 'react'
import './CelebrationToast.css'

function CelebrationToast() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1600)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div className="celebration-toast">
      <img src={`${import.meta.env.BASE_URL}run.gif`} alt="" />
    </div>
  )
}

export default CelebrationToast
