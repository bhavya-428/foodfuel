import React, { useState, useEffect, useContext } from 'react'
import './Header.css'
import logo from "../assets/logo.png"
import { NavLink, Link, useLocation } from "react-router-dom"
import { StoreContext } from '../StoreContext'

function Header() {
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const { cart, wishlist, currentUser, logout } = useContext(StoreContext);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  return (
    <header className='header'>
      <div className='logo'>
        <Link to="/">
          <img className='img1' src={logo} alt="Food Club Logo" />
        </Link>
      </div>

      <nav className='nav'>
        <ul>
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
            <>
              <NavLink to="/Orders" className="orders-link">My Orders</NavLink>
              <span className="user-email">{currentUser.email.split('@')[0]}</span>
              <button className="btn logout-btn" onClick={logout}>Logout</button>
            </>
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
