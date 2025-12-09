import React from "react";
import { useNavigate } from "react-router-dom";
import image from "../images/heroimg.jpg";
import "../styles/hero.css";

const Hero = () => {
  const navigate = useNavigate();

  const handleBookAppointment = () => {
    navigate("/doctors");
  };

  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <div className="hero-badge">
          <span>🏥 Healthcare Excellence</span>
        </div>
        <h1>
          Your Health, <br />
          <span className="highlight">Our Priority</span>
        </h1>
        <p>
          Experience world-class healthcare with our expert doctors, advanced
          technology, and personalized care. Book appointments instantly and get
          the medical attention you deserve from the comfort of your home.
        </p>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-number">5000+</span>
            <span className="stat-label">Happy Patients</span>
          </div>
          <div className="stat">
            <span className="stat-number">200+</span>
            <span className="stat-label">Expert Doctors</span>
          </div>
          <div className="stat">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Support</span>
          </div>
        </div>
        <div className="hero-buttons">
          <button className="btn primary-btn" onClick={handleBookAppointment}>
            Book Appointment
          </button>
          <button className="btn secondary-btn" onClick={handleBookAppointment}>
            Find Doctors
          </button>
        </div>
      </div>
      <div className="hero-image">
        <div className="image-container">
          <img src={image} alt="Professional healthcare" />
          <div className="floating-card">
            <div className="card-icon">👨‍⚕️</div>
            <div className="card-content">
              <h4>Expert Care</h4>
              <p>Board-certified specialists</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
