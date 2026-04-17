import React, { useState, useEffect, useContext } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, getDocs, doc, updateDoc } from 'firebase/firestore';
import { StoreContext } from '../StoreContext';
import { Navigate } from 'react-router-dom';
import './Admin.css';

function Admin() {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'menu'
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser, isAdmin, authLoading } = useContext(StoreContext);

  // New Item State
  const [newItem, setNewItem] = useState({ name: '', price: '', type: 'Ice Creams', img: '' });

  useEffect(() => {
    const fetchData = async () => {
      if (!isAdmin) return;
      setLoading(true);

      try {
        if (activeTab === 'orders') {
          const q = query(collection(db, 'orders'), orderBy('timestamp', 'desc'));
          const querySnapshot = await getDocs(q);
          setOrders(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } else {
          const q = query(collection(db, 'menuItems'), orderBy('id', 'asc'));
          const querySnapshot = await getDocs(q);
          setMenuItems(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
      } catch (error) {
        console.error(`Error fetching ${activeTab}:`, error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchData();
    }
  }, [isAdmin, authLoading, activeTab]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });
      setOrders(orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'menuItems'), {
        ...newItem,
        id: Date.now() // Simple id generation
      });
      alert("Item added successfully!");
      setNewItem({ name: '', price: '', type: 'Ice Creams', img: '' });
      // Refresh menu
      const q = query(collection(db, 'menuItems'), orderBy('id', 'asc'));
      const querySnapshot = await getDocs(q);
      setMenuItems(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  if (authLoading) return <div className="spinner" style={{margin: '100px auto'}}></div>;
  if (!isAdmin) return <Navigate to="/Home" />;

  const totalRevenue = orders.reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0);

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1>Admin Dashboard</h1>

        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders Management
          </button>
          <button 
            className={`tab-btn ${activeTab === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('menu')}
          >
            Menu Management
          </button>
        </div>

        {activeTab === 'orders' ? (
          <>
            <div className="admin-stats">
              <div className="stat-card">
                <h3>Total Orders</h3>
                <p>{orders.length}</p>
              </div>
              <div className="stat-card">
                <h3>Total Revenue</h3>
                <p>₹{totalRevenue.toFixed(2)}</p>
              </div>
            </div>

            <h2 className="admin-section-title">Recent Orders</h2>
            {loading ? <div className="spinner" style={{margin: '50px auto'}}></div> : (
              <div className="table-responsive">
                <table className="admin-orders-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td>{order.id.slice(0, 5)}</td>
                        <td>{order.shippingInfo?.fullName}</td>
                        <td>{order.items.map(i => i.name).join(', ')}</td>
                        <td>₹{parseFloat(order.total).toFixed(2)}</td>
                        <td>
                          <select 
                            className={`status-select ${(order.status || 'Pending').toLowerCase()}`}
                            value={order.status || 'Pending'}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          <div className="menu-management">
            <div className="add-item-form card">
              <h3>Add New Menu Item</h3>
              <form onSubmit={handleAddItem}>
                <input type="text" placeholder="Name" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} required />
                <input type="text" placeholder="Price (e.g. 50/-)" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} required />
                <select 
                  value={newItem.type} 
                  onChange={e => setNewItem({...newItem, type: e.target.value})}
                  className="status-select"
                  style={{width: '100%', marginBottom: '15px'}}
                >
                  <option value="Ice Creams">Ice Creams</option>
                  <option value="Sundaes">Sundaes</option>
                  <option value="Waffles">Waffles</option>
                  <option value="Shakes">Shakes</option>
                  <option value="Cakes">Cakes</option>
                  <option value="Smoothies">Smoothies</option>
                  <option value="Shawarma">Shawarma</option>
                  <option value="Starters">Starters</option>
                  <option value="Pizzas">Pizzas</option>
                </select>
                <input type="text" placeholder="Image URL" value={newItem.img} onChange={e => setNewItem({...newItem, img: e.target.value})} required />
                <button type="submit" className="browse-btn">Add Item</button>
              </form>
            </div>

            <h2 className="admin-section-title">Current Menu ({menuItems.length})</h2>
            <div className="menu-grid-admin">
              {menuItems.map(item => (
                <div key={item.id} className="menu-item-mini">
                  <img src={item.img} alt={item.name} />
                  <div>
                    <strong>{item.name}</strong>
                    <p>{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
