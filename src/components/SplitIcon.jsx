import './SplitIcon.css'

function SplitIcon({ icon: Icon, size = 22, strokeWidth = 2 }) {
  return (
    <span className="split-icon" style={{ width: size, height: size }}>
      <Icon size={size} strokeWidth={strokeWidth} className="split-icon-half split-icon-green" />
      <Icon size={size} strokeWidth={strokeWidth} className="split-icon-half split-icon-pink" />
    </span>
  )
}

export default SplitIcon
