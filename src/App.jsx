import React, { useEffect } from 'react'
import './App.css'
import Header from './component/Header.jsx'
import HeroSec from './component/herosec.jsx'
import { Routes, Route } from "react-router-dom"
import Home from './Pages/Home.jsx'
import About from './Pages/About.jsx'
import Contact from './Pages/Contact.jsx'
import Menu from './Pages/Menu.jsx'
import Franchise from './Pages/Franchise.jsx'
import Cart from './Pages/Cart.jsx'
import Wishlist from './Pages/Wishlist.jsx'
import Checkout from './Pages/Checkout.jsx'
import Auth from './Pages/Auth.jsx'
import Orders from './Pages/Orders.jsx'
import { seedMenu } from './menuSeed'

function App() {
  useEffect(() => {
    seedMenu();
  }, []);

  return (
    <div>
      <Header />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/About" element={<About />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/Menu" element={<Menu />} />
        <Route path="/Franchise" element={<Franchise />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/Checkout" element={<Checkout />} />
        <Route path="/Auth" element={<Auth />} />
        <Route path="/Orders" element={<Orders />} />
      </Routes>
    </div>
  );
}

export default App
