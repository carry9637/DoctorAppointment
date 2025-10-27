import React, { useState } from "react";
import "../styles/contact.css";

const Contact = () => {
  const [formDetails, setFormDetails] = useState({
    name: "",
    email: "",
    message: "",
  });

  const inputChange = (e) => {
    const { name, value } = e.target;
    return setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">
        {/* Hero Contact Section */}
        <div className="contact-hero">
          <div className="hero-content">
            <h1 className="hero-title">
              Let's Start a<span className="highlight"> Conversation</span>
            </h1>
            <p className="hero-description">
              Ready to transform your healthcare experience? We're here to
              listen, understand, and provide the personalized care you deserve.
            </p>
          </div>
          <div className="hero-visual">
            <div className="floating-elements">
              <div className="floating-circle circle-1">💬</div>
              <div className="floating-circle circle-2">❤️</div>
              <div className="floating-circle circle-3">🏥</div>
            </div>
          </div>
        </div>

        {/* Contact Methods */}
        <div className="contact-methods">
          <div className="methods-grid">
            <div className="method-item">
              <div className="method-icon">📞</div>
              <div className="method-content">
                <h3>Speak with Us</h3>
                <p>Call our friendly team for immediate assistance</p>
                <div className="contact-details">
                  <span>+1 (555) 123-4567</span>
                  <span>+1 (555) 987-6543</span>
                </div>
              </div>
            </div>

            <div className="method-item">
              <div className="method-icon">📧</div>
              <div className="method-content">
                <h3>Write to Us</h3>
                <p>Send us an email and we'll respond within 24 hours</p>
                <div className="contact-details">
                  <span>hello@healthcareplus.com</span>
                  <span>support@healthcareplus.com</span>
                </div>
              </div>
            </div>

            <div className="method-item">
              <div className="method-icon">📍</div>
              <div className="method-content">
                <h3>Visit Our Office</h3>
                <p>Come experience our modern facility in person</p>
                <div className="contact-details">
                  <span>123 Wellness Boulevard</span>
                  <span>Medical District, MD 12345</span>
                </div>
              </div>
            </div>

            <div className="method-item">
              <div className="method-icon">🕒</div>
              <div className="method-content">
                <h3>Operating Hours</h3>
                <p>We're here when you need us most</p>
                <div className="contact-details">
                  <span>Mon-Fri: 7:00 AM - 9:00 PM</span>
                  <span>Sat-Sun: 8:00 AM - 6:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-section">
          <div className="form-container">
            <div className="form-header">
              <h2>Send us a Message</h2>
              <p>
                Have a specific question or need detailed information? We'd love
                to hear from you.
              </p>
            </div>

            <form
              method="POST"
              action={`https://formspree.io/f/${process.env.REACT_FORMIK_SECRET}`}
              className="contact-form"
            >
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-input"
                    placeholder="Enter your full name"
                    value={formDetails.name}
                    onChange={inputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    placeholder="Enter your email"
                    value={formDetails.email}
                    onChange={inputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  className="form-input textarea"
                  placeholder="Tell us how we can help you..."
                  value={formDetails.message}
                  onChange={inputChange}
                  rows="6"
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn form-btn">
                <span>Send Message</span>
                <span className="btn-icon">✉️</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
