import React, { useState, useEffect, useContext } from 'react';
import { db } from '../firebase';
import { collection, query, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
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
  // Menu Management form states
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [menuForm, setMenuForm] = useState({ name: '', price: '', type: 'Ice Creams', img: '' });
  // Fetch all necessary data on mount
  useEffect(() => {
    const fetchAllData = async () => {
      if (!isAdmin) return;
      setLoading(true);
      try {
        // 1. Fetch Orders
        let ordersList = [];
        try {
          const ordersSnap = await getDocs(collection(db, 'orders'));
          ordersList = ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (err) {
          console.warn("Could not fetch orders from Firestore:", err);
        }

        const localOrders = JSON.parse(localStorage.getItem('localOrders') || '[]').map(o => {
          const d = o.timestamp?.seconds ? new Date(o.timestamp.seconds * 1000) : new Date(o.timestamp || Date.now());
          return {
            ...o,
            timestamp: {
              toDate: () => d,
              seconds: Math.floor(d.getTime() / 1000)
            }
          };
        });

        const allOrders = [...ordersList, ...localOrders];
        allOrders.sort((a, b) => {
          const tA = a.timestamp?.toDate() || new Date(0);
          const tB = b.timestamp?.toDate() || new Date(0);
          return tB - tA;
        });
        setOrders(allOrders);

        // 2. Fetch Menu Items
        let menuList = [];
        try {
          const menuSnap = await getDocs(collection(db, 'menuItems'));
          menuList = menuSnap.docs.map(doc => ({ ...doc.data(), docId: doc.id }));
        } catch (err) {
          console.warn("Could not fetch menu items from Firestore:", err);
        }

        if (menuList.length === 0) {
          // Import menuItems locally for admin panel too if firestore has none or fails
          // But we can import from menuSeed directly using window or import it
          const { menuItems: localMenu } = await import('../menuSeed');
          menuList = localMenu;
        }
        menuList.sort((a, b) => (a.id || 0) - (b.id || 0));
        setMenuItems(menuList);

        // 3. Fetch Users
        let usersList = [];
        try {
          const usersSnap = await getDocs(collection(db, 'users'));
          usersList = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (err) {
          console.warn("Could not fetch users from Firestore:", err);
        }

        const localUsers = JSON.parse(localStorage.getItem('localUsers') || '[]').map(u => {
          const d = new Date(u.joinDate);
          return {
            ...u,
            id: u.uid,
            joinDate: {
              toDate: () => d
            }
          };
        });

        const allUsers = [...usersList, ...localUsers];
        allUsers.sort((a, b) => {
          const tA = a.joinDate?.toDate() || new Date(0);
          const tB = b.joinDate?.toDate() || new Date(0);
          return tB - tA;
        });
        setUsers(allUsers);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && isAdmin) {
      fetchAllData();
    }
  }, [isAdmin, authLoading]);

  // Order status transition handler
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      if (orderId.startsWith('local-')) {
        const localOrders = JSON.parse(localStorage.getItem('localOrders') || '[]');
        const updatedLocal = localOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
        localStorage.setItem('localOrders', JSON.stringify(updatedLocal));
        setOrders(orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
        return;
      }

      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });
      setOrders(orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  // Remove registered user handler
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this user from the database?")) return;
    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsers(users.filter(u => u.id !== userId));
      alert("User removed successfully.");
    } catch (error) {
      console.error("Error removing user:", error);
      alert("Failed to remove user.");
    }
  };

  // Menu Add Item handler
  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const newItemData = {
        name: menuForm.name,
        price: menuForm.price,
        type: menuForm.type,
        img: menuForm.img,
        id: Date.now() // Unique numeric identifier for lists/carts
      };
      
      const docRef = await addDoc(collection(db, 'menuItems'), newItemData);
      alert("Menu item added successfully!");
      
      setMenuItems([...menuItems, { ...newItemData, docId: docRef.id }]);
      setMenuForm({ name: '', price: '', type: 'Ice Creams', img: '' });
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Failed to add menu item.");
    }
  };

  // Menu Edit Item handler
  const handleEditItem = async (e) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const itemRef = doc(db, 'menuItems', editingItem.docId);
      const updatedFields = {
        name: menuForm.name,
        price: menuForm.price,
        type: menuForm.type,
        img: menuForm.img
      };

      await updateDoc(itemRef, updatedFields);
      alert("Menu item updated successfully!");

      setMenuItems(menuItems.map(item => 
        item.docId === editingItem.docId ? { ...item, ...updatedFields } : item
      ));

      // Reset editing states
      setMenuForm({ name: '', price: '', type: 'Ice Creams', img: '' });
      setEditingItem(null);
      setIsEditMode(false);
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Failed to update menu item.");
    }
  };

  // Menu Delete Item handler
  const handleDeleteMenuItem = async (docId) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) return;
    try {
      await deleteDoc(doc(db, 'menuItems', docId));
      setMenuItems(menuItems.filter(item => item.docId !== docId));
      alert("Menu item deleted successfully.");
    } catch (error) {
      console.error("Error deleting menu item:", error);
      alert("Failed to delete menu item.");
    }
  };

  // Database Utilities: Reset Data
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
      window.location.reload(); 
    } catch (error) {
      console.error("Error resetting data:", error);
      alert("Reset failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // Database Utilities: Clean Duplicates
  const handleCleanDuplicates = async () => {
    if (!window.confirm("This will scan the menu and remove duplicate items. Proceed?")) return;
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'menuItems'));
      const seen = new Set();
      const toDelete = [];

      snap.docs.forEach(d => {
        const name = d.data().name;
        if (!name || seen.has(name)) {
          toDelete.push(d.id); 
        } else {
          seen.add(name);
        }
      });

      if (toDelete.length === 0) {
        alert("No duplicates found! Your menu is already clean. ✅");
        setLoading(false);
        return;
      }

      await Promise.all(toDelete.map(docId => deleteDoc(doc(db, 'menuItems', docId))));
      alert(`Cleaned ${toDelete.length} duplicate item(s) from the menu!`);
      window.location.reload();
    } catch (error) {
      console.error("Error cleaning duplicates:", error);
      alert("Failed to clean duplicates.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <div className="spinner" style={{margin: '100px auto'}}></div>;
  if (!isAdmin) return <Navigate to="/Home" />;

  // Calculate statistics values
  const totalRevenue = orders.reduce((sum, order) => {
    if ((order.status || 'Pending').toLowerCase() === "cancelled") return sum; 
    return sum + (parseFloat(order.total) || 0);
  }, 0);

  const pendingOrders = orders.filter(o => (o.status || 'Pending') === 'Pending').length;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
  const totalCustomers = users.length;

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
              <div className="stat-card">
                <h3>Pending Orders</h3>
                <p>{pendingOrders}</p>
              </div>
              <div className="stat-card">
                <h3>Delivered Orders</h3>
                <p>{deliveredOrders}</p>
              </div>
              <div className="stat-card">
                <h3>Total Customers</h3>
                <p>{totalCustomers}</p>
              </div>
            </div>

            <h2 className="admin-section-title">All Customer Orders</h2>
            {loading ? <div className="spinner" style={{margin: '50px auto'}}></div> : (
              <div className="table-responsive">
                <table className="admin-orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Ordered Items</th>
                      <th>Address</th>
                      <th>Total Amount</th>
                      <th>Order Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => {
                      const orderDate = order.timestamp?.toDate() 
                        ? order.timestamp.toDate().toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                          })
                        : 'N/A';
                      
                      const addressString = order.shippingInfo
                        ? `${order.shippingInfo.address || ''}, ${order.shippingInfo.city || ''} - ${order.shippingInfo.zipCode || ''} (Phone: ${order.shippingInfo.phone || ''})`
                        : 'N/A';

                      return (
                        <tr key={order.id}>
                          <td><strong className="order-id-txt">#{order.id.slice(0, 6).toUpperCase()}</strong></td>
                          <td>
                            <div className="customer-info-cell">
                              <span className="cust-name">{order.customerName || order.shippingInfo?.fullName || 'Guest'}</span>
                              <span className="cust-email">{order.customerEmail || order.shippingInfo?.email || 'N/A'}</span>
                            </div>
                          </td>
                          <td>
                            <div className="items-list-cell">
                              {order.items.map((i, idx) => (
                                <div key={idx} className="item-row">
                                  {i.quantity}x {i.name}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="address-info-cell">
                            <span className="address-txt" title={addressString}>{addressString}</span>
                          </td>
                          <td><strong className="amount-txt">₹{parseFloat(order.total || 0).toFixed(2)}</strong></td>
                          <td><span className="date-txt">{orderDate}</span></td>
                          <td>
                            <select 
                              className={`status-select ${(order.status || 'Pending').toLowerCase().replace(/\s+/g, '-')}`}
                              value={order.status || 'Pending'}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Preparing">Preparing</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan="7" style={{textAlign: 'center', padding: '30px'}}>
                          No orders placed yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {activeTab === 'menu' && (
          <div className="menu-management">
            <div className="add-item-form card">
              <h3>{isEditMode ? 'Edit Menu Item' : 'Add New Menu Item'}</h3>
              <form onSubmit={isEditMode ? handleEditItem : handleAddItem}>
                <div className="form-group-admin">
                  <label>Item Name</label>
                  <input 
                    type="text" 
                    placeholder="Name" 
                    value={menuForm.name} 
                    onChange={e => setMenuForm({...menuForm, name: e.target.value})} 
                    required 
                  />
                </div>
                <div className="form-group-admin">
                  <label>Price</label>
                  <input 
                    type="text" 
                    placeholder="Price (e.g. 50/- or $5.99)" 
                    value={menuForm.price} 
                    onChange={e => setMenuForm({...menuForm, price: e.target.value})} 
                    required 
                  />
                </div>
                <div className="form-group-admin">
                  <label>Category</label>
                  <select 
                    value={menuForm.type} 
                    onChange={e => setMenuForm({...menuForm, type: e.target.value})}
                    className="status-select"
                    style={{width: '100%'}}
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
                </div>
                <div className="form-group-admin">
                  <label>Image URL</label>
                  <input 
                    type="text" 
                    placeholder="Image URL" 
                    value={menuForm.img} 
                    onChange={e => setMenuForm({...menuForm, img: e.target.value})} 
                    required 
                  />
                </div>
                
                <div className="form-actions-admin">
                  <button type="submit" className="browse-btn">
                    {isEditMode ? 'Save Changes' : 'Add Item'}
                  </button>
                  {isEditMode && (
                    <button 
                      type="button" 
                      className="btn cancel-edit-btn" 
                      onClick={() => {
                        setIsEditMode(false);
                        setEditingItem(null);
                        setMenuForm({ name: '', price: '', type: 'Ice Creams', img: '' });
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="menu-list-section">
              <h2 className="admin-section-title">Current Menu ({menuItems.length})</h2>
              {loading ? <div className="spinner" style={{margin: '50px auto'}}></div> : (
                <div className="menu-grid-admin">
                  {menuItems.map(item => (
                    <div key={item.docId || item.id} className="menu-item-mini-card">
                      <img src={item.img} alt={item.name} className="menu-item-img-admin" />
                      <div className="menu-item-text-admin">
                        <strong className="menu-item-name-admin">{item.name}</strong>
                        <span className="menu-item-category-admin">{item.type}</span>
                        <p className="menu-item-price-admin">{item.price}</p>
                      </div>
                      <div className="menu-item-actions-admin">
                        <button 
                          className="edit-btn-admin" 
                          onClick={() => {
                            setEditingItem(item);
                            setMenuForm({
                              name: item.name,
                              price: item.price,
                              type: item.type,
                              img: item.img
                            });
                            setIsEditMode(true);
                          }}
                          title="Edit Item"
                        >
                          Edit
                        </button>
                        <button 
                          className="delete-btn-admin" 
                          onClick={() => handleDeleteMenuItem(item.docId)}
                          title="Delete Item"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  {menuItems.length === 0 && (
                    <p style={{textAlign: 'center', gridColumn: '1/-', padding: '30px'}}>
                      No menu items found. Add one above!
                    </p>
                  )}
                </div>
              )}
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
            
            <h2 className="admin-section-title">Registered Customers</h2>
            {loading ? <div className="spinner" style={{margin: '50px auto'}}></div> : (
              <div className="table-responsive">
                <table className="admin-orders-table">
                  <thead>
                    <tr>
                      <th>User Name</th>
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
                          {user.joinDate?.toDate() ? user.joinDate.toDate().toLocaleDateString('en-US', {
                            year: 'numeric', month: 'long', day: 'numeric'
                          }) : 'N/A'}
                        </td>
                        <td>
                          <button 
                            className="logout-btn" 
                            style={{padding: '5px 12px', fontSize: '0.8rem', background: '#e74c3c', borderRadius: '50px', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer'}}
                            onClick={() => handleDeleteUser(user.id)}
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
          <div className="card" style={{borderColor: '#e74c3c', borderStyle: 'dashed', display: 'flex', flexDirection: 'column', gap: '20px', padding: '30px', borderRadius: '24px', background: 'rgba(231,76,60,0.02)'}}>
            <div>
              <p style={{color: '#868686ff', marginBottom: '10px'}}>
                <strong>Clean Duplicate Menu Items</strong><br/>
                Scan and remove any duplicate items from your menu.
              </p>
              <button className="btn" style={{background: '#e67e22', width: 'auto', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer'}} onClick={handleCleanDuplicates}>
                Clean Duplicates
              </button>
            </div>
            <hr style={{borderColor: 'rgba(231,76,60,0.3)'}} />
            <div>
              <p style={{color: '#888', marginBottom: '10px'}}>
                <strong>Reset Customer Database</strong><br/>
                Delete ALL orders, wishlists, and member profiles (except yours). <strong>Cannot be undone.</strong>
              </p>
              <button className="btn" style={{background: '#e74c3c', width: 'auto', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer'}} onClick={handleResetData}>
                Reset Customer Database
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
