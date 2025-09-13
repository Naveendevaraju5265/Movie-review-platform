import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaSearch, FaUser, FaSignOutAlt, FaFilm } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <FaFilm className="navbar-icon" />
          MovieReview
        </Link>

        <div className="navbar-search">
          {/* <FaSearch className="search-icon" /> */}
          <input
            type="text"
            placeholder="Search movies..."
            className="search-input"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const query = e.target.value.trim();
                if (query) {
                  navigate(`/?search=${encodeURIComponent(query)}`);
                }
              }
            }}
          />
        </div>

        <div className="navbar-menu">
          {user ? (
            <div className="navbar-user">
              <Link to="/profile" className="navbar-link">
                <FaUser className="navbar-icon" />
                {user.username}
              </Link>
              <button onClick={handleLogout} className="navbar-link logout-btn">
                <FaSignOutAlt className="navbar-icon" />
                Logout
              </button>
            </div>
          ) : (
            <div className="navbar-auth">
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="navbar-link navbar-link-primary">
                Register
              </Link>
            </div>
          )}

          <button
            className="navbar-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {isMenuOpen && (
          <div className="navbar-mobile">
            {user ? (
              <div className="navbar-mobile-user">
                <Link 
                  to="/profile" 
                  className="navbar-mobile-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaUser className="navbar-icon" />
                  Profile
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="navbar-mobile-link logout-btn"
                >
                  <FaSignOutAlt className="navbar-icon" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="navbar-mobile-auth">
                <Link 
                  to="/login" 
                  className="navbar-mobile-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="navbar-mobile-link navbar-link-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
