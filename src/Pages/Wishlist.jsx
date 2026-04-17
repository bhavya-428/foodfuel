import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { StoreContext } from '../StoreContext';
import './Wishlist.css';

function Wishlist() {
  const { wishlist, toggleWishlist, addToCart } = useContext(StoreContext);

  return (
    <div className="wishlist-page">
      <div className="wishlist-container">
        <h1>Your Sweet Wishlist</h1>
        
        {wishlist.length === 0 ? (
          <div className="empty-wishlist">
            <span className="empty-icon">💝</span>
            <h2>Your wishlist is empty</h2>
            <p>Save your favorite treats for later and they'll appear here!</p>
            <Link to="/Menu">
              <button className="explore-btn">Explore Our Menu</button>
            </Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map((item) => (
              <div key={item.id} className="wishlist-card">
                <button 
                  className="remove-wishlist-btn" 
                  onClick={() => toggleWishlist(item)}
                  aria-label="Remove from wishlist"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                
                <div className="wishlist-card-img-container">
                  <div 
                    className="wishlist-card-img" 
                    style={{ backgroundImage: `url(${item.img})` }}
                  ></div>
                </div>
                
                <div className="wishlist-card-content">
                  <h3>{item.name}</h3>
                  <div className="wishlist-card-bottom">
                    <span className="wishlist-price">{item.price}</span>
                    <button 
                      className="add-to-cart-btn" 
                      onClick={() => addToCart(item)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;