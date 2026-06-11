import React, { useState, useEffect, useContext } from 'react';
import { db } from '../firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { StoreContext } from '../StoreContext';
import { Link } from 'react-router-dom';
import './Orders.css';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(StoreContext);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        let fetchedOrders = [];
        try {
          let q;
          let querySnapshot;
          try {
            q = query(
              collection(db, 'orders'),
              where('userId', '==', currentUser.uid),
              orderBy('timestamp', 'desc')
            );
            querySnapshot = await getDocs(q);
          } catch (idxErr) {
            console.warn("Index not built yet, falling back to client-side sorting:", idxErr);
            q = query(
              collection(db, 'orders'),
              where('userId', '==', currentUser.uid)
            );
            querySnapshot = await getDocs(q);
          }
          fetchedOrders = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        } catch (dbErr) {
          console.warn("Failed to fetch orders from Firestore. Using local fallback.", dbErr);
        }

        // Get local orders for this user
        const localOrders = JSON.parse(localStorage.getItem('localOrders') || '[]')
          .filter(o => o.userId === currentUser.uid)
          .map(o => {
            const d = o.timestamp?.seconds ? new Date(o.timestamp.seconds * 1000) : new Date(o.timestamp || Date.now());
            return {
              ...o,
              timestamp: {
                toDate: () => d,
                seconds: Math.floor(d.getTime() / 1000)
              }
            };
          });

        const allOrders = [...fetchedOrders, ...localOrders];

        // Sort in memory
        allOrders.sort((a, b) => {
          const tA = a.timestamp?.toDate() || new Date(0);
          const tB = b.timestamp?.toDate() || new Date(0);
          return tB - tA;
        });

        setOrders(allOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="orders-page">
        <div className="no-orders">
          <h2>Please Login</h2>
          <p>Login to see your order history and track your deliveries.</p>
          <Link to="/Auth" className="browse-btn">Login Now</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="orders-page">
        <div style={{ textAlign: 'center', padding: '100px' }}>
          <h3>Fetching your orders...</h3>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        <h1>My Orders</h1>
        
        {orders.length === 0 ? (
          <div className="no-orders">
            <h2>No orders yet!</h2>
            <p>Looks like you haven't placed any orders. Let's find something delicious!</p>
            <Link to="/Menu" className="browse-btn">Browse Menu</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order ID: <span className="order-id">{order.id.slice(0, 8).toUpperCase()}</span></h3>
                    <p className="order-date">
                      {order.timestamp?.toDate().toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className={`order-status ${(order.status || 'Pending').toLowerCase().replace(/\s+/g, '-')}`}>{order.status || 'Pending'}</div>
                </div>

                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <span>
                        <span className="item-qty">{item.quantity}x</span>
                        {item.name}
                      </span>
                      <span>{item.price}</span>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="delivery-info">
                    Delivering to: <strong>{order.shippingInfo.city}</strong>
                  </div>
                  <div className="order-total">
                    Total: ₹{parseFloat(order.total).toFixed(2)}
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

export default Orders;
