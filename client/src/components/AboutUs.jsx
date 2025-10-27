import React from "react";

const AboutUs = () => {
  return (
    <section className="about-section">
      <div className="container">
        <div className="about-header">
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle">
            Comprehensive healthcare services provided by our expert medical
            team
          </p>
        </div>

        <div className="about-content">
          <div className="about-services">
            <div className="service-card">
              <div className="service-icon">🩺</div>
              <h4>General Medicine</h4>
              <p>
                Comprehensive primary care including routine check-ups,
                preventive care, and treatment of common illnesses
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">❤️</div>
              <h4>Cardiology</h4>
              <p>
                Advanced heart care including diagnosis, treatment, and
                prevention of cardiovascular diseases
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">👶</div>
              <h4>Pediatrics</h4>
              <p>
                Specialized care for infants, children, and adolescents with a
                focus on growth and development
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">🦴</div>
              <h4>Orthopedics</h4>
              <p>
                Expert treatment for bone, joint, and muscle conditions
                including sports injuries and arthritis
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">🧴</div>
              <h4>Dermatology</h4>
              <p>
                Comprehensive skin care including treatment of skin conditions,
                cosmetic procedures, and skin cancer screening
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">🚑</div>
              <h4>Emergency Care</h4>
              <p>
                24/7 emergency medical services for critical conditions
                requiring immediate attention
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">🧠</div>
              <h4>Neurology</h4>
              <p>
                Specialized care for brain, spinal cord, and nervous system
                disorders and diseases
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">👁️</div>
              <h4>Ophthalmology</h4>
              <p>
                Complete eye care including vision correction, eye disease
                treatment, and surgical procedures
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
