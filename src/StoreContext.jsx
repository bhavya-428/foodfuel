import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Admin configuration
  const ADMIN_EMAILS = ['v.bhavyasri2001@gmail.com'];

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAdmin(user ? ADMIN_EMAILS.includes(user.email) : false);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Sync Wishlist with Firestore when user logs in
  useEffect(() => {
    if (!currentUser) return;

    const wishlistRef = doc(db, 'wishlists', currentUser.uid);
    
    const unsubscribe = onSnapshot(wishlistRef, (docSnap) => {
      if (docSnap.exists()) {
        setWishlist(docSnap.data().items || []);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Save Cart to LocalStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Save Wishlist to LocalStorage (for guests)
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    // Also save to Firestore if logged in
    if (currentUser) {
      const wishlistRef = doc(db, 'wishlists', currentUser.uid);
      setDoc(wishlistRef, { items: wishlist }, { merge: true });
    }
  }, [wishlist, currentUser]);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem => 
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prevCart) => 
      prevCart.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const toggleWishlist = (item) => {
    setWishlist((prevWishlist) => {
      const isWishlisted = prevWishlist.some(w => w.id === item.id);
      if (isWishlisted) {
        return prevWishlist.filter(w => w.id !== item.id);
      }
      return [...prevWishlist, item];
    });
  };

  const logout = async () => {
    await signOut(auth);
    setWishlist([]); // Clear local wishlist state on logout
  };

  return (
    <StoreContext.Provider value={{
      cart,
      wishlist,
      currentUser,
      isAdmin,
      authLoading,
      addToCart,
      removeFromCart,
      updateQuantity,
      toggleWishlist,
      logout
    }}>
      {children}
    </StoreContext.Provider>
  );
};
