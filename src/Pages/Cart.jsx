import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { StoreContext } from '../StoreContext';
import './Cart.css';

function Cart() {
  const { cart, updateQuantity, removeFromCart } = useContext(StoreContext);

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const priceVal = parseFloat(item.price.replace(/[^0-9.]/g, ''));
      return total + (isNaN(priceVal) ? 0 : priceVal * item.quantity);
    }, 0);
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1 className="cart-title">Your Sweet Cart</h1>
        
        {cart.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2 className="empty-cart-title">Your cart is empty</h2>
            <p className="empty-cart-text">Looks like you haven't added any sweet treats yet.</p>
            <Link to="/Menu">
              <button className="explore-btn">
                Explore Our Menu
              </button>
            </Link>
          </div>
        ) : (
          <div className="cart-items-wrapper">
            <div className="cart-list">
              {cart.map((item, index) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-info">
                    <img src={item.img} alt={item.name} className="cart-item-img" />
                    <div>
                      <h3 className="cart-item-name">{item.name}</h3>
                      <p className="cart-item-price">{item.price}</p>
                    </div>
                  </div>
                  
                  <div className="cart-item-actions">
                    <div className="quantity-control">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="quantity-btn"
                      >
                        -
                      </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="quantity-btn"
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="remove-btn"
                      title="Remove Item"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="cart-summary">
              <div>
                <p className="total-label">Total Amount</p>
                <h2 className="total-amount">${calculateTotal().toFixed(2)}</h2>
              </div>
              <Link to="/Checkout">
                <button className="checkout-btn">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;