import React from 'react'
import './About.css'

function About() {
  return (
    <div className="about-container">
      <div className="about-grid">
        <div className="about-content">
          <h4 className="about-tagline">Our Story</h4>
          <h1 className="about-title">The Magic Behind Food Club</h1>
          <p className="about-description">
            Born from a passion for sweet moments, Food Club has grown from a small family kitchen into the town's most beloved dessert destination. 
          </p>
          <p className="about-paragraph">
            We believe that every bite should be an experience. That's why we source only the finest organic ingredients, from Belgian chocolate to hand-picked berries. Our mission is simple: to create joy, one scoop at a time.
          </p>
          <div className="about-stats">
            <div>
              <h2 className="stat-number">10+</h2>
              <p className="stat-label">Years Experience</p>
            </div>
            <div>
              <h2 className="stat-number">50+</h2>
              <p className="stat-label">Dessert Types</p>
            </div>
            <div>
              <h2 className="stat-number">100k</h2>
              <p className="stat-label">Happy Foodies</p>
            </div>
          </div>
        </div>
        <div className="about-image-wrapper">
          <img 
            src="https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=800&auto=format&fit=crop" 
            alt="About us" 
            className="about-image"
          />
          <div className="about-quote-box">
            <p className="about-quote-text">"The best waffles I've ever had in my life!"</p>
            <p className="about-quote-author">- Sarah J., Food Critic</p>
          </div>
        </div>
      </div>

      <div className="team-section">
        <h2 className="team-title">Meet Our Team</h2>
        <div className="team-grid">
          {[
            { img: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80', name: 'Chef Mario', role: 'Head Pastry Chef' },
            { img: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&q=80', name: 'Julia Roberts', role: 'Master Chocolatier' },
            { img: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=400&q=80', name: 'James Doe', role: 'Operations Manager' }
          ].map((member, index) => (
            <div key={index} className="team-card">
              <img src={member.img} alt={member.name} className="team-member-img" />
              <h3 className="team-member-name">{member.name}</h3>
              <p className="team-member-role">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Core Values Section */}
      <div className="values-section">
        <h2 className="values-title">Our Core Values</h2>
        <div className="values-grid">
          {[
            { title: "Artisanal Craft", desc: "Every dessert is meticulously handcrafted by experts.", icon: "✨" },
            { title: "Community First", desc: "We support local farmers and build sweet connections.", icon: "🤝" },
            { title: "Sustainability", desc: "Eco-friendly packaging and carbon-neutral deliveries.", icon: "🌱" }
          ].map((value, i) => (
            <div key={i} className="value-card">
              <div className="value-icon">{value.icon}</div>
              <h3 className="value-title">{value.title}</h3>
              <p className="value-desc">{value.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Behind The Scenes Gallery */}
      <div className="gallery-section">
        <h2 className="gallery-title">Behind The Scenes</h2>
        <div className="gallery-grid">
          <img src="https://images.ctfassets.net/ueprkma36dz5/29H2YWBdMYBmZ9lXWHQ4iM/0e947e155436629d8c5af48c020097e9/food-hygiene-featured.jpg" alt="Kitchen Prep" className="gallery-img" />
          <img src="https://hospitalityinsights.ehl.edu/hs-fs/hubfs/Food_plating.jpg?width=700&height=462&name=Food_plating.jpg" alt="Plating" className="gallery-img" />
          <img src="https://img.freepik.com/free-photo/organic-farm-carrot-harvest-lying-near-bottle-with-milk-glass-half-filled-with-natural-fresh-juice-breakfast_346278-705.jpg?semt=ais_incoming&w=740&q=80" alt="Fresh Ingredients" className="gallery-img" />
        </div>
      </div>
    </div>
  )
}

export default About
