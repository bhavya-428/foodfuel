import React, { useState, useContext, useEffect } from 'react';
import { StoreContext } from '../StoreContext';
import { db } from '../firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import './HorizontalMenu.css';

const categories = [
  { name: "All" },
  { name: "Ice Creams"},
  { name: "Sundaes" },
  { name: "Waffles" },
  { name: "Shakes" },
  { name: "Cakes" },
  { name: "Smoothies" },
  { name: "Shawarma"},
  { name: "Starters"  },
  { name: "Pizzas"  },
];

function HorizontalMenu() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, toggleWishlist, wishlist } = useContext(StoreContext);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const querySnapshot = await getDocs(query(collection(db, 'menuItems'), orderBy('id', 'asc')));
        const items = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          docId: doc.id
        }));
        setMenuItems(items);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const filteredItems = activeCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.type === activeCategory);

  if (loading) {
    return (
      <div className="horizontal-menu-container">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h3>Loading our delicious menu...</h3>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="horizontal-menu-container">
      <div className="category-scroll-wrapper">
        <ul className="category-list">
          {categories.map((cat, index) => (
            <li 
              key={index} 
              className={`category-item ${activeCategory === cat.name ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.name)}
            >
              <span className="category-icon">{cat.icon}</span>
              {cat.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="menu-grid">
        {filteredItems.map(item => {
          const isWishlisted = wishlist.some(w => w.id === item.id);
          return (
            <div key={item.docId || item.id} className="menu-card">
              <div className="menu-card-img-container">
                <div className="menu-card-img" style={{ backgroundImage: `url(${item.img})` }}></div>
                <span className="menu-badge">{item.type}</span>
                <button 
                  className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
                  onClick={() => toggleWishlist(item)}
                  aria-label="Toggle wishlist"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={isWishlisted ? "red" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                </button>
              </div>
              <div className="menu-card-content">
                <h3>{item.name}</h3>
                <div className="menu-card-bottom">
                  <span className="menu-price">{item.price}</span>
                  <button className="add-btn" aria-label="Add to bag" onClick={() => addToCart(item)}>+</button>
                </div>
              </div>
            </div>
          );
        })}
        {filteredItems.length === 0 && (
          <div className="no-items">
            <p>No items found for this category yet!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HorizontalMenu;
