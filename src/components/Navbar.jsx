import { Link } from 'react-router-dom'
import { Compass, Search } from 'lucide-react'
import SplitIcon from './SplitIcon'
import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <SplitIcon icon={Compass} size={22} />
        <span className="navbar-brand-text">Off the Map</span>
      </Link>

      <div className="navbar-links">
        <Link to="/" className="navbar-link">
          Discover
        </Link>
      </div>

      <button type="button" className="navbar-icon-button" aria-label="Search">
        <Search size={20} strokeWidth={2} />
      </button>

      <Link to="/create" className="btn-primary navbar-share">
        Share
      </Link>
    </nav>
  )
}

export default Navbar
