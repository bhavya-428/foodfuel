import React from 'react'
import HorizontalMenu from '../component/HorizontalMenu.jsx'
import './Menu.css'

function Menu() {
  return (
    <div className="menu-page">
      <div className="menu-header">
        <h1>Our Menu</h1>
        <p>
          Explore our delicious selection of treats. Scroll horizontally through the categories below to discover every dessert type!
        </p>
      </div>
      <HorizontalMenu />
    </div>
  )
}

export default Menu
