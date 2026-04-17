import React, { useState, useEffect, useContext } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { StoreContext } from '../StoreContext';
import { Navigate } from 'react-router-dom';
import './Admin.css';

function Admin() {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'menu', or 'users'
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [users, setUsers] = useState([]);
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
        } else if (activeTab === 'menu') {
          const q = query(collection(db, 'menuItems'), orderBy('id', 'asc'));
          const querySnapshot = await getDocs(q);
          setMenuItems(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } else if (activeTab === 'users') {
          const q = query(collection(db, 'users'), orderBy('joinDate', 'desc'));
          const querySnapshot = await getDocs(q);
          setUsers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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

  const handleDeleteDoc = async (collectionName, id) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    try {
      await deleteDoc(doc(db, collectionName, id));
      if (collectionName === 'users') {
        setUsers(users.filter(u => u.id !== id));
      }
    } catch (error) {
      console.error("Error deleting document:", error);
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

     const handleResetData = async () => {
    const confirmation = window.prompt("WARNING: This will delete ALL orders and ALL member profiles (except yours). This cannot be undone. Type 'RESET' to confirm.");
    if (confirmation !== 'RESET') return;

    setLoading(true);
    try {
      // 1. Delete all Orders
      const orderSnap = await getDocs(collection(db, 'orders'));
      const orderDeletions = orderSnap.docs.map(d => deleteDoc(doc(db, 'orders', d.id)));
      
      // 2. Delete all Wishlists
      const wishlistSnap = await getDocs(collection(db, 'wishlists'));
      const wishlistDeletions = wishlistSnap.docs.map(d => deleteDoc(doc(db, 'wishlists', d.id)));

      // 3. Delete all Users (Except Admin)
      const userSnap = await getDocs(collection(db, 'users'));
      const userDeletions = userSnap.docs
        .filter(d => d.data().email !== 'v.bhavyasri2001@gmail.com')
        .map(d => deleteDoc(doc(db, 'users', d.id)));

      await Promise.all([...orderDeletions, ...wishlistDeletions, ...userDeletions]);
      
      alert("Database Reset Successful! All customer data has been cleared.");
      window.location.reload(); // Refresh to show clean slate
    } catch (error) {
      console.error("Error resetting data:", error);
      alert("Reset failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = orders.reduce((sum, order) => {
        if (order.status === "cancelled") return sum; // skip cancelled
         return sum + (parseFloat(order.total) || 0);
                 }, 0);

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1>Admin Dashboard</h1>

        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
          <button 
            className={`tab-btn ${activeTab === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('menu')}
          >
            Menu
          </button>
          <button 
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Members
          </button>
        </div>

        {activeTab === 'orders' && (
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
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {activeTab === 'menu' && (
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

        {activeTab === 'users' && (
          <div className="users-management">
             <div className="admin-stats" style={{marginBottom: '30px'}}>
              <div className="stat-card">
                <h3>Total Members</h3>
                <p>{users.length}</p>
              </div>
            </div>
            
            <h2 className="admin-section-title">Signed-in Members</h2>
            {loading ? <div className="spinner" style={{margin: '50px auto'}}></div> : (
              <div className="table-responsive">
                <table className="admin-orders-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Joined Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td><strong>{user.fullName}</strong></td>
                        <td>{user.email}</td>
                        <td>
                          {user.joinDate?.toDate().toLocaleDateString('en-US', {
                            year: 'numeric', month: 'long', day: 'numeric'
                          })}
                        </td>
                        <td>
                          <button 
                            className="logout-btn" 
                            style={{padding: '5px 10px', fontSize: '0.8rem', background: '#e74c3c'}}
                            onClick={() => handleDeleteDoc('users', user.id)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan="4" style={{textAlign: 'center', padding: '30px'}}>
                          No members recorded in the database yet. 
                          <br />
                          <small>(Only users who sign up after today's updates will appear here)</small>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        <div className="danger-zone">
          <h2 className="admin-section-title" style={{color: '#e74c3c', borderColor: '#e74c3c'}}>Danger Zone</h2>
          <div className="card" style={{borderColor: '#e74c3c', borderStyle: 'dashed'}}>
            <p style={{color: '#888', marginBottom: '15px'}}>
              Reset the customer database to clear all orders, wishlists, and non-admin profiles. 
              <strong> This cannot be undone.</strong>
            </p>
            <button className="btn" style={{background: '#e74c3c', width: 'auto'}} onClick={handleResetData}>
              Reset Customer Database
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
