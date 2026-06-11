import React, { useState, useEffect, useContext, useRef } from 'react'
import './Header.css'
import logo from "../assets/logo.png"
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom"
import { StoreContext } from '../StoreContext'

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { cart, wishlist, currentUser, userProfile, isAdmin, logout } = useContext(StoreContext);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setDropdownOpen(false);
  }, [location]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogout = async () => {
    try {
      await logout();
      setDropdownOpen(false);
      navigate('/Home');
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const displayName = userProfile?.fullName || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';
  
  return (
    <header className='header'>
      <div className='logo'>
        <Link to="/">
          <img className='img1' src={logo} alt="Food Club Logo" />
        </Link>
      </div>

      <button className="mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle Menu">
        {isMenuOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        )}
      </button>

      <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
        <ul className="nav-links">
          <li><NavLink to="/Home">Home</NavLink></li>
          <li><NavLink to="/About">About</NavLink></li>
          <li><NavLink to="/Menu">Menu</NavLink></li>
          <li><NavLink to="/Franchise">Franchise</NavLink></li>
          <li><NavLink to="/Contact">Contact</NavLink></li>
        </ul>
        <div className="header-actions">
          <button 
            className="theme-toggle" 
            onClick={toggleTheme} 
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            )}
          </button>
          
          <Link to="/wishlist" className="icon-link" aria-label="Wishlist">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
          </Link>
          
          <Link to="/Cart" className="icon-link" aria-label="Cart">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            {cart.reduce((total, i) => total + i.quantity, 0) > 0 && (
              <span className="badge">{cart.reduce((total, i) => total + i.quantity, 0)}</span>
            )}
          </Link>

           {currentUser ? (
            <div className="profile-dropdown-container" ref={dropdownRef}>
              <button 
                className="profile-trigger" 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                <div className="profile-avatar">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <span className="profile-name">
                  {displayName}
                  {isAdmin && <span className="admin-badge-inline">Admin</span>}
                </span>
                <svg 
                  className={`chevron-icon ${dropdownOpen ? 'open' : ''}`} 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-user-info">
                    <p className="user-info-name">{displayName}</p>
                    <p className="user-info-email">{currentUser.email}</p>
                  </div>
                  <hr className="dropdown-divider" />
                  
                  {isAdmin && (
                    <Link 
                      to="/Admin" 
                      className="dropdown-item admin-panel-link"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
                      Admin Panel
                    </Link>
                  )}
                  
                  <Link 
                    to="/Orders" 
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                    My Orders
                  </Link>
                  
                  <hr className="dropdown-divider" />
                  
                  <button className="dropdown-item logout-item" onClick={handleLogout}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/Auth">
              <button className='btn'>Login</button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Header