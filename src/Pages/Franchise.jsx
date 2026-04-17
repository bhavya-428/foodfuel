import React from 'react'
import './Franchise.css'

function Franchise() {
  return (
    <div className="franchise-page">
      <div className="franchise-hero">
        <h1 className="hero-title">Grow With Us</h1>
        <p className="hero-desc">Join the fastest growing dessert franchise and bring sweet joy to your community.</p>
      </div>

      <div className="franchise-container">
        <div className="section-header">
          <h2 className="section-title">Why Choose Food Club?</h2>
          <div className="section-divider"></div>
        </div>

        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">📈</div>
            <h3 className="benefit-title">Proven Business Model</h3>
            <p className="benefit-desc">We've optimized every aspect of the dessert business to ensure high margins and operational efficiency.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🍦</div>
            <h3 className="benefit-title">Exclusive Recipes</h3>
            <p className="benefit-desc">Access our secret vault of award-winning dessert recipes that keep customers coming back for more.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🛠️</div>
            <h3 className="benefit-title">Full Support</h3>
            <p className="benefit-desc">From location scouting to staff training, we are with you every step of the way to ensure your success.</p>
          </div>
        </div>

        <div className="inquiry-section">
          <h2 className="inquiry-title">Ready to Start Your Journey?</h2>
          <p className="inquiry-desc">Download our franchise kit to see the full investment details and requirements.</p>
          <button className="inquire-btn">
            Inquire Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default Franchise

