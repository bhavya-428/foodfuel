import React, { useContext } from 'react'
import { StoreContext } from '../StoreContext'
import HeroSec from '../component/herosec.jsx'
import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
  const { wishlist, toggleWishlist } = useContext(StoreContext);
  return (
    <div className="home-container">
      <HeroSec />
      
      <div className="home-intro">
        <h4 className="home-tagline">Taste the Magic</h4>
        <h1 className="home-title">Crafting Sweet Memories Since 2012</h1>
        <p className="home-description">
          Welcome to Food Club, where every dessert is a masterpiece. From our signature sundaes to handcrafted waffles, we bring you the finest flavors from around the world.
        </p>
        <Link to="/Menu">
          <button className="home-cta-button">
            Explore Our Menu
          </button>
        </Link>
      </div>

      <div className='home-features'>
        {[
          { icon: '🍦', title: 'Fresh Ingredients', desc: 'Sourced daily from local organic farms.' },
          { icon: '👨‍🍳', title: 'Master Chefs', desc: 'Crafted by award-winning dessert artisans.' },
          { icon: '🚚', title: 'Fast Delivery', desc: 'Freshness delivered right to your doorstep.' }
        ].map((feature, i) => (
          <div key={i} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3 style={{fontSize:"22px"}} >{feature.title}</h3>
            <p style={{fontSize:"18px"}} >{feature.desc}</p>
          </div>
        ))}
      </div>

      <div className="popular-section">
        <h2 className="popular-title">Popular Delights</h2>
        <div className="delights-grid">
          {[
            { id: 15, img: 'https://content.jdmagicbox.com/v2/comp/mumbai/r5/022pxx22.xx22.190116204535.h5r5/catalogue/the-belgian-waffle-co--goregaon-west-mumbai-waffle-centres-0ps2dlrmuc.jpg', name: 'Belgian Waffle', price: '$8.99' },
            { id: 102, img: 'https://images.getrecipekit.com/20250325120225-how-20to-20make-20chocolate-20molten-20lava-20cake-20in-20the-20microwave.png?width=650&quality=90&', name: 'Choco Lava Cake', price: '$6.50' },
            { id: 94, img: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&q=80', name: 'Strawberry Sundae', price: '$7.20' }
          ].map((item, index) => {
            const isWishlisted = wishlist.some(w => w.id === item.id);
            return (
              <div key={index} className="delight-card">
                <img src={item.img} alt={item.name} className="delight-image" />
                
                <button 
                  onClick={() => toggleWishlist(item)}
                  className="wishlist-btn"
                  style={{
                    color: isWishlisted ? 'var(--primary)' : '#ccc'
                  }}
                  aria-label="Toggle wishlist"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                </button>

                <div className="delight-content">
                  <h3 className="delight-name">{item.name}</h3>
                  <p className="delight-price">{item.price}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="testimonials-section">
        <div className="testimonials-container">
          <h2 className="testimonials-title">Sweet Words From Sweet People</h2>
          <div className="testimonials-grid">
            {[
              { text: "Food Club is my absolute favorite place for weekend treats. The sundaes are out of this world!", author: "Emily R." },
              { text: "We ordered their custom waffles for a party, and everyone was blown away. Outstanding quality and taste.", author: "James M." },
              { text: "I've visited dessert shops globally, but the rich Belgian chocolates here have a unique charm. Unbeatable!", author: "Sophia P." }
            ].map((review, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
                <p style={{fontSize:"18px"}} >"{review.text}"</p>
                <h4 style={{fontSize:"20px"}} >- {review.author}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="newsletter-section">
        <div className="newsletter-card">
          <h2 className="newsletter-title">Never Miss a Sweet Moment</h2>
          <p className="newsletter-desc">Join our newsletter for exclusive dessert releases, VIP discounts, and sweet stories.</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="newsletter-input"
            />
            <button className="newsletter-btn">
              Subscribe Now
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Home

