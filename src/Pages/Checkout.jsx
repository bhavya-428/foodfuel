import React, { useContext, useState } from 'react';
import { StoreContext } from '../StoreContext';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './Checkout.css';

function Checkout() {
  const { cart, removeFromCart, currentUser } = useContext(StoreContext);
  const [isOrdered, setIsOrdered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    phone: '',
    paymentMethod: 'card'
  });

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => {
      const priceVal = parseFloat(item.price.replace(/[^0-9.]/g, ''));
      return total + (isNaN(priceVal) ? 0 : priceVal * item.quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const deliveryFee = subtotal > 0 ? 5.00 : 0;
  const total = subtotal + deliveryFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        userId: currentUser ? currentUser.uid : 'guest',
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        shippingInfo: formData,
        total: total,
        timestamp: serverTimestamp()
      };

      await addDoc(collection(db, 'orders'), orderData);
      
      // Clear cart
      cart.forEach(item => removeFromCart(item.id));
      setIsOrdered(true);
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isOrdered) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="checkout-card checkout-success">
            <div className="success-icon">🎉</div>
            <div className="success-message">
              <h2>Order Placed Successfully!</h2>
              <p>Thank you for choosing Food Club. Your delicious treats will reach you soon!</p>
              <Link to="/Home">
                <button className="back-home-btn">Back to Home</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="checkout-card checkout-success">
            <div className="success-icon">🛒</div>
            <div className="success-message">
              <h2>Your cart is empty</h2>
              <p>Add some sweet treats before checking out!</p>
              <Link to="/Menu">
                <button className="back-home-btn">Explore Menu</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1 className="checkout-title">Finalize Your Order</h1>
        
        <form className="checkout-grid" onSubmit={handleSubmit}>
          <div className="checkout-card">
            <h2>Shipping Information</h2>
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                name="fullName" 
                placeholder="John Doe" 
                required 
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="john@example.com" 
                  required 
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  name="phone" 
                  placeholder="+91 12345 67890" 
                  required 
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Shipping Address</label>
              <textarea 
                name="address" 
                placeholder="House No, Street, Landmark" 
                required 
                rows="3"
                value={formData.address}
                onChange={handleInputChange}
              ></textarea>
            </div>
            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label>City</label>
                <input 
                  type="text" 
                  name="city" 
                  placeholder="Mumbai" 
                  required 
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Zip Code</label>
                <input 
                  type="text" 
                  name="zipCode" 
                  placeholder="400001" 
                  required 
                  value={formData.zipCode}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Payment Method</label>
              <select 
                name="paymentMethod" 
                value={formData.paymentMethod}
                onChange={handleInputChange}
              >
                <option value="card">Credit / Debit Card</option>
                <option value="upi">UPI / GPay</option>
                <option value="cod">Cash on Delivery</option>
              </select>
            </div>
          </div>

          <div className="checkout-card">
            <h2>Order Summary</h2>
            <div className="order-summary-list">
              {cart.map(item => (
                <div key={item.id} className="summary-item">
                  <div className="item-info">
                    <img src={item.img} alt={item.name} className="item-thumbnail" />
                    <div>
                      <div className="item-name">{item.name}</div>
                      <div className="item-qty">Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <div className="item-price">
                    ${(parseFloat(item.price.replace(/[^0-9.]/g, '')) * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button type="submit" className="place-order-btn" disabled={loading}>
              {loading ? 'Processing...' : 'Place Your Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
