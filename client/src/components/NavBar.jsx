import React from 'react'
import { Link } from 'react-router-dom'

function NavBar({ user, setUser }) {
  const handleLogout = () => {
    setUser(null)
    // Additional logout logic can be added here
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          My Queer Pregnancy
        </Link>
        <div className="nav-menu">
          <Link to="/" className="nav-link">Home</Link>
          {user ? (
            <>
              <Link to="/journal" className="nav-link">My Journal</Link>
              <button onClick={handleLogout} className="nav-link logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default NavBar