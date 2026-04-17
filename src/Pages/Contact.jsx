import React from 'react'
import './Contact.css'

function Contact() {
  return (
    <div className="contact-container">
      <div className="contact-header">
        <h4 className="contact-tagline">Contact Us</h4> 
        <h1 className="contact-title">Let's Talk Dessert</h1>
        <p className="contact-desc">Have a question or want to book for an event? Send us a message and we'll get back to you within 24 hours.</p>
      </div>

      <div className="contact-cards">
        <div className="contact-card">
          <div className="card-icon">📍</div>
          <h3 className="card-title">Our Location</h3>
          <p className="card-text">123 Sweet Street, Dessert Valley, NY 10001</p>
        </div>
        <div className="contact-card">
          <div className="card-icon">📞</div>
          <h3 className="card-title">Phone Number</h3>
          <p className="card-text">(+91)9618896169</p>
        </div>
        <div className="contact-card">
          <div className="card-icon">📧</div>
          <h3 className="card-title">Email Address</h3>
          <p className="card-text">hello@foodclub.com</p>
        </div>
      </div>

      <div className="contact-form-wrapper">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-row">
            <input type="text" placeholder="Your Name" className="form-input" />
            <input type="email" placeholder="Your Email" className="form-input" />
          </div>
          <input type="text" placeholder="Subject" className="form-input" />
          <textarea placeholder="Your Message" className="form-textarea"></textarea>
          <button className="submit-btn">
            Send Message
          </button>
        </form>
      </div>
    </div>
  )
}

export default Contact

